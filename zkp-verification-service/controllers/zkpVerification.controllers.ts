import { Status } from "@grpc/grpc-js/build/src/constants.js";
import { AddAmountWithRangeCommitmentRequest, AddBGExpiryRequest, AddClauseInclusionCommitmentRequest, AmountWithinRangeRequest, BGExpiryCheckRequest, VerifyClauseInclusionRequest, ZKPVerificationServiceServer } from "../src/protoOutput/zkpVerification.js";
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
import getCommitmentHash from "../src/utils/utilities/getCommitmentHash.js";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const {

    CLAUSE_INCLUSION_CONTRACT_ADDRESS: clauseInclusionAddress, 
    BG_EXPIRY_CHECK_CONTRACT_ADDRESS: bgExpiryAddress,
    AMOUNT_WITHIN_RANGE_CONTRACT_ADDRESS: amountWithinRangeAddress

} = process.env;

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

    async addClauseInclusionCommitment(call, callback) {

        try {

            const { agreementId,clauseSetHash } = call.request as AddClauseInclusionCommitmentRequest;

            if (!clauseSetHash || !agreementId) {

                callback({ code: Status.INVALID_ARGUMENT, message: "please provide clauseSetHash, agreementId" });
                return;

            }

            const data = {agreementId,clauseSetHash};

            const bytes32Value = await getCommitmentHash(data) as string;


            console.log("The commitment we are getting is ", bytes32Value);

            const contract = await getContractInstance(clauseInclusionAddress as string, clauseInclusionAbi);

            const tx = await contract.addClauseInclusionCommitment(agreementId, bytes32Value);

            console.log("The transaction hash we are getting is", tx?.hash);

            if(!tx?.hash){

                callback({code: Status.INTERNAL, message: "Failed to Add The Commitment Onchain"});
                return;

            }

            callback(null,{success: true, message: "sucess", commitment: bytes32Value, txHash: tx?.hash});



        } catch (error) {

            console.log(error);

            callback({ code: Status.INTERNAL, message: "Internal Server Error" });

        }

    },

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
            const contract = await getContractInstance(clauseInclusionAddress as string, clauseInclusionAbi);


            const contractCommitment = await contract.clauseInclusionCommitments(agreementId);

            console.log("The commitment from user  we are getting is", commitment);
            console.log("the commitment from contract we are getting is", contractCommitment);

            const { a: A, b: B, c: C, inputSignals } = await generateClauseInclusionProof({ agreementId, clauseSetHash, commitment: contractCommitment }, WASM_PATH, ZKEY_PATH) as GenerateProofType;

            if (!A || !B || !C || !inputSignals) {

                callback({ message: "Failed To Generate Proof", code: Status.NOT_FOUND });
                return;

            }

            console.log("A", A)
            console.log("B", B)
            console.log("C", C)
            console.log("input signals", inputSignals)



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

    async addBgExpiry(call, callback){

        try {
      
            const {bgExpiry,POenddate,Ndays, bgId} = call.request as AddBGExpiryRequest;

            if(!bgExpiry || !POenddate || !Ndays || !bgId){

                return callback({code: Status.INVALID_ARGUMENT, message: "please provide bgExpiry,POendate,Ndays,bgId"});

            }

            const data = {bgExpiry};

            const commitment = await getCommitmentHash(data) as string;

            const contract = await getContractInstance(bgExpiryAddress as string, BGExpiryAbi);

            const tx = await contract.registerBG(bgId,commitment);

            if(!tx?.hash){

                return callback({code: Status.UNKNOWN, message: "failed to add commitment"});

            }

            callback(null,{success: true, message: "Commiment Added Sucessfully", txHash: tx?.hash, commitment})



        } catch (error) {

            console.log(error);

            return callback({code: Status.INTERNAL, message: "Internal Server Error"});
            
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

            const contract = await getContractInstance(bgExpiryAddress  as string, BGExpiryAbi);

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

    async addAmountWithRangeCommitment(call,callback){

        try {
            
            const {invoiceTotal, poBalance, id} = call.request as AddAmountWithRangeCommitmentRequest;

            if(!invoiceTotal || !poBalance || !id){

                return callback({code: Status.INVALID_ARGUMENT, message: "please provide inoviceTotal, poBalance and id"});

            }

            const data = {poBalance};

            const commitment = await getCommitmentHash(data);

            const contract = await getContractInstance(amountWithinRangeAddress as string, AmountWithinRangeAbi);

            const tx = await contract.addAmountWithinRangeCommitment(id, commitment);

            if(!tx?.hash){

                return callback({code: Status.UNKNOWN, message: "failed to add commitment"});

            }

            return callback(null,{success: true, message: "Commitment Added Successfully", txHash: tx?.hash, commitment: commitment as string});
            

        } catch (error) {

            console.log(error);

            return callback({code: Status.INTERNAL, message: "Internal Server Error"});
            
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

            const contract = await getContractInstance(amountWithinRangeAddress as string, AmountWithinRangeAbi);


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



