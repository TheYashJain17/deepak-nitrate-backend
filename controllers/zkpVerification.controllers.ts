import { Status } from "@grpc/grpc-js/build/src/constants";
import { VerifyClauseInclusionRequest, ZKPVerificationServiceServer } from "../src/protoOutput/zkpVerification";
import getContractInstance from "../src/utils/utilities/getContractInstance";

import path from "path";
import { GenerateProofType, ZKPErrorType } from "../src/types/types";
import generateProof from "../src/utils/utilities/generateProof";

import { clauseInclusionAbi } from "../src/utils/ABIs/clauseInclusion.abi";

const WASM_PATH: string = path.join(process.cwd(), "src/utils/circomFiles/clauseInclusion/clauseInclusion.wasm");
const ZKEY_PATH: string = path.join(process.cwd(), "src/utils/circomFiles/clauseInclusion/clauseInclusion_final.zkey");

const isZKPError = (error: unknown): error is ZKPErrorType => {
    return (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        "userMessage" in error &&
        "statusCode" in error
    );
};


export const ZKPVerificationServiceHandlers: ZKPVerificationServiceServer = {

    async verifyClauseInclusion(call, callback) {

        let isProofValid: boolean;

        try {

            const { agreementId, clauseSetHash, commitment } = call.request as VerifyClauseInclusionRequest;

            if (!agreementId || !clauseSetHash || !commitment) {

                callback({ code: Status.INVALID_ARGUMENT, message: "please provide agreementId,clauseSetHash,commitment" });
                return;

            }

            // const data = {
            //     agreementId, clauseSetHash
            // }

            // const commitment = await getCommitmentHash(data) as string;

            const { a: A, b: B, c: C, inputSignals } = await generateProof({ agreementId, clauseSetHash, commitment }, WASM_PATH, ZKEY_PATH) as GenerateProofType;

            if (!A || !B || !C || !inputSignals) {

                callback({message: "Failed To Generate Proof", code: Status.NOT_FOUND});
                return;

            }

            console.log("A", A)
            console.log("B", B)
            console.log("C", C)
            console.log("input signals", inputSignals)


            const contract = await getContractInstance(process.env.CLAUSE_INCLUSION_CONTRACT_ADDRESS as string, clauseInclusionAbi);

            isProofValid = await contract.verifyClauseInclusionCommitment(agreementId, A, B, C, inputSignals);

            console.log("the result we are getting is", isProofValid);

            callback(null, {success: true, message: "success", isValid: isProofValid})


        } catch (error: unknown) {

            // console.log(error);

            console.log("The error we are getting is", error);
            
            if(isZKPError(error)){

                callback({message: error?.code, details: JSON.stringify({isValid: false, success: false}), code: error.statusCode}, null);
                return
            }


            // callback({ message: errorMsg, code: Status.INTERNAL });
            // callback(null, {message: "Internal Server Error", isValid: false, success: false })
            callback({message: "Internal Server Error", code: Status.INTERNAL, details: JSON.stringify({isValid: false, success: false}) }, null);
            return;

        }

    }

}



