import { Status } from "@grpc/grpc-js/build/src/constants.js";
import { AmountWithinRangeRequest, BGExpiryCheckRequest, VerifyClauseInclusionRequest, ZKPVerificationServiceServer } from "../src/protoOutput/zkpVerification.js";
import getContractInstance from "../src/utils/utilities/getContractInstance.js";

import path from "path";
import { GenerateProofType, ZKPErrorType } from "../src/types/types.js";


import { clauseInclusionAbi } from "../src/utils/ABIs/clauseInclusion.abi.js";
import generateClauseInclusionProof from "../src/utils/generateProofs/generateClauseInclusionProof.js";
import generateBGExpiryCheckProof from "../src/utils/generateProofs/generateBGExpiryCheckProof.js";
import { BGExpiryAbi } from "../src/utils/ABIs/bgExpiryCheck.abi.js";
import generateAmountWithinRangeProof from "../src/utils/generateProofs/generateAmountWithinRangeProof.js";
import { AmountWithinRangeAbi } from "../src/utils/ABIs/amountWithinRange.abi.js";

import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

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

        //This is for prod means for docker
        // const WASM_PATH: string = path.resolve(__dirname, "../../circomFiles/clauseInclusion/clauseInclusion.wasm");
        // const ZKEY_PATH: string = path.resolve(__dirname, "../../circomFiles/clauseInclusion/clauseInclusion_final.zkey");


        //this is for local
        const WASM_PATH: string = path.join(process.cwd(), "src/utils/circomFiles/clauseInclusion/clauseInclusion.wasm");
        const ZKEY_PATH: string = path.join(process.cwd(), "src/utils/circomFiles/clauseInclusion/clauseInclusion_final.zkey");
        try {

            const { agreementId, clauseSetHash, commitment } = call.request as VerifyClauseInclusionRequest;

            if (!agreementId || !clauseSetHash || !commitment) {

                callback({ code: Status.INVALID_ARGUMENT, message: "please provide agreementId,clauseSetHash,commitment" });
                return;

            }

            const { a: A, b: B, c: C, inputSignals } = await generateClauseInclusionProof({ agreementId, clauseSetHash, commitment }, WASM_PATH, ZKEY_PATH) as GenerateProofType;

            if (!A || !B || !C || !inputSignals) {

                callback({ message: "Failed To Generate Proof", code: Status.NOT_FOUND });
                return;

            }

            console.log("A", A)
            console.log("B", B)
            console.log("C", C)
            console.log("input signals", inputSignals)


            const contract = await getContractInstance(process.env.CLAUSE_INCLUSION_CONTRACT_ADDRESS as string, clauseInclusionAbi);

            isProofValid = await contract.verifyClauseInclusionCommitment(agreementId, A, B, C, inputSignals);

            console.log("the result we are getting is", isProofValid);

            callback(null, { success: true, message: "success", isValid: isProofValid })


        } catch (error: unknown) {

            // console.log(error);

            console.log("The error we are getting is", error);

            if (isZKPError(error)) {

                callback({ message: error?.code, details: JSON.stringify({ isValid: false, success: false }), code: error.statusCode }, null);
                return
            }
            callback({ message: "Internal Server Error", code: Status.INTERNAL, details: JSON.stringify({ isValid: false, success: false }) }, null);
            return;

        }

    },

    async bgExpiryCheck(call, callback) {

        let isProofValid: boolean;

        //This is for prod means docker
        // const WASM_PATH: string = path.resolve(__dirname, "../../circomFiles/bgExpiryCheck/bgExpiryCheck.wasm");
        // const ZKEY_PATH: string = path.resolve(__dirname, "../../circomFiles/bgExpiryCheck/bgExpiryCheck_final.zkey");

        // This is for local
        const WASM_PATH: string = path.join(process.cwd(), "src/utils/circomFiles/bgExpiryCheck/bgExpiryCheck.wasm");
        const ZKEY_PATH: string = path.join(process.cwd(), "src/utils/circomFiles/bgExpiryCheck/bgExpiryCheck_final.zkey");


        try {

            const { bgExpiry, NDays, POEndDate, bgExpiryHash } = call.request as BGExpiryCheckRequest;

            if (!bgExpiry || !NDays || !POEndDate || !bgExpiryHash) {

                callback({ code: Status.INVALID_ARGUMENT, message: "please provide bgExpiry,NDays,POEndDate,bgExpiryHash" });
                return;

            }

            const { a: A, b: B, c: C, inputSignals } = await generateBGExpiryCheckProof({ bg_expiry: bgExpiry, bg_expiry_hash: bgExpiryHash, N_days: NDays, PO_end_date: POEndDate }, WASM_PATH, ZKEY_PATH) as GenerateProofType;

            if (!A || !B || !C || !inputSignals) {

                callback({ code: Status.NOT_FOUND, message: "Failed To Generate Proof" });
                return;

            }

            console.log("The public signals we are getting is ", inputSignals);

            const contract = await getContractInstance(process.env.BG_EXPIRY_CHECK_CONTRACT_ADDRESS as string, BGExpiryAbi);

            isProofValid = await contract.verifyBG(A, B, C, inputSignals);

            console.log("the result we are getting is", isProofValid);

            callback(null, { isValid: isProofValid, message: "sucess", success: true });


        } catch (error) {


            console.log("The error we are getting is", error);

            if (isZKPError(error)) {

                callback({ message: error?.code, details: JSON.stringify({ isValid: false, success: false }), code: error.statusCode }, null);
                return
            }
            callback({ message: "Internal Server Error", code: Status.INTERNAL, details: JSON.stringify({ isValid: false, success: false }) }, null);
            return;


        }

    },

    async amountWithinRange(call, callback) {

        let isProofValid: boolean;

        //This is for prod means docker
        // const WASM_PATH: string = path.resolve(__dirname, "../../circomFiles/amountWithinRange/amountWithinRange.wasm");
        // const ZKEY_PATH: string = path.resolve(__dirname, "../../circomFiles/amountWithinRange/amountWithinRange_final.zkey");

        //This is for local
        const WASM_PATH: string = path.join(process.cwd(), "src/utils/circomFiles/amountWithinRange/amountWithinRange.wasm");
        const ZKEY_PATH: string = path.join(process.cwd(), "src/utils/circomFiles/amountWithinRange/amountWithinRange_final.zkey");

        try {

            const { invoiceTotal, poBalance, poBalanceHash } = call.request as AmountWithinRangeRequest;

            if (!invoiceTotal || !poBalance || !poBalanceHash) {

                callback({ code: Status.INVALID_ARGUMENT, message: "please provide invoiceTotal, poBalance, poBalanceHash" });
                return;

            }

            const { a: A, b: B, c: C, inputSignals } = await generateAmountWithinRangeProof({ invoiceTotal, poBalance, poBalance_hash: poBalanceHash }, WASM_PATH, ZKEY_PATH) as GenerateProofType;

            if (!A || !B || !C || !inputSignals) {

                callback({ code: Status.NOT_FOUND, message: "Failed To Generate Proof" });
                return;

            }


            console.log("The public signals we are getting is ", inputSignals);

            const contract = await getContractInstance(process.env.AMOUNT_WITHIN_RANGE_CONTRACT_ADDRESS as string, AmountWithinRangeAbi);


            isProofValid = await contract.verifyAmoutWithinRangeCommitment(A, B, C, inputSignals);

            console.log("the result we are getting is", isProofValid);

            callback(null, { isValid: isProofValid, message: "success", success: true });

        } catch (error) {

            console.log("The error we are getting is", error);

            if (isZKPError(error)) {

                callback({ message: error?.code, details: JSON.stringify({ isValid: false, success: false }), code: error.statusCode }, null);
                return
            }
            callback({ message: "Internal Server Error", code: Status.INTERNAL, details: JSON.stringify({ isValid: false, success: false }) }, null);
            return;

        }

    }

}



