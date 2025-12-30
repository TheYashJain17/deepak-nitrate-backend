import { Status } from "@grpc/grpc-js/build/src/constants";
import { ClauseInclusionServiceServer, VerifyClauseInclusionRequest } from "../src/protoOutput/clauseInclusion";
import getContractInstance from "../src/utils/utilities/getContractInstance";

import path from "path";
import { GenerateProofType } from "../src/types/types";

const WASM_PATH: string = path.join(process.cwd(), "src/utils/circomFiles/clauseInclusion.wasm");
const ZKEY_PATH: string = path.join(process.cwd(), "src/utils/circomFiles/clauseInclusion_final.zkey");

export const ClauseInclusionServiceHandlers: ClauseInclusionServiceServer = {

    async verifyClauseInclusion(call, callback) {

        let isProofValid: boolean;

        try {

            const { agreementId, clauseSetHashId, commitment } = call.request as VerifyClauseInclusionRequest;

            if (!agreementId || !clauseSetHashId || !commitment) {

                callback({ code: Status.INVALID_ARGUMENT, message: "please provide agreementId,clauseSetHashId,commitment" });
                return;

            }

            // const data = {
            //     agreementId, clauseSetHashId
            // }

            // const commitment = await getCommitmentHash(data) as string;

            const { a: A, b: B, c: C, inputSignals } = await generateProof({ agreementId, clauseSetHashId, commitment }, WASM_PATH, ZKEY_PATH) as GenerateProofType;

            if (!A || !B || !C || !inputSignals) {

                callback({message: "Failed To Generate Proof", code: Status.NOT_FOUND});
                return;

            }

            console.log("A", A)
            console.log("B", B)
            console.log("C", C)
            console.log("input signals", inputSignals)


            const contract = await getContractInstance();

            isProofValid = await contract.verifyClauseInclusionCommitment(agreementId, A, B, C, inputSignals);

            console.log("the result we are getting is", isProofValid);

            callback(null, {success: true, message: "success", isValid: isProofValid})


        } catch (error: any) {

            console.log(error);

            console.log("The error we are getting is", error);

            let errorMsg: string;

            if (error?.revert?.args[0]) {

                errorMsg = error?.revert?.args[0];

            } else if (error?.message?.includes("CONSTRAINT")) {

                errorMsg = "Condition Failed,Should be Invoice total ≤ PO balance";

            } else {

                errorMsg = "Internal Server Error";

            }

            console.log("the errormsg we are getting is", errorMsg);

            callback({ message: errorMsg, code: Status.INTERNAL });
            return;

        }

    }

}



