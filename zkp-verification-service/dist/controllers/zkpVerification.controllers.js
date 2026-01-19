var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Status } from "@grpc/grpc-js/build/src/constants.js";
import getContractInstance from "../src/utils/utilities/getContractInstance.js";
import path from "path";
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
const { CLAUSE_INCLUSION_CONTRACT_ADDRESS: clauseInclusionAddress, BG_EXPIRY_CHECK_CONTRACT_ADDRESS: bgExpiryAddress, AMOUNT_WITHIN_RANGE_CONTRACT_ADDRESS: amountWithinRangeAddress } = process.env;
const isZKPError = (error) => {
    return (typeof error === "object" &&
        error !== null &&
        "code" in error &&
        "userMessage" in error &&
        "statusCode" in error);
};
export const ZKPVerificationServiceHandlers = {
    addClauseInclusionCommitment(call, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { agreementId, clauseSetHash } = call.request;
                if (!clauseSetHash || !agreementId) {
                    callback({ code: Status.INVALID_ARGUMENT, message: "please provide clauseSetHash, agreementId" });
                    return;
                }
                const data = { agreementId, clauseSetHash };
                const bytes32Value = yield getCommitmentHash(data);
                console.log("The commitment we are getting is ", bytes32Value);
                const contract = yield getContractInstance(clauseInclusionAddress, clauseInclusionAbi);
                const tx = yield contract.addClauseInclusionCommitment(agreementId, bytes32Value);
                console.log("The transaction hash we are getting is", tx === null || tx === void 0 ? void 0 : tx.hash);
                if (!(tx === null || tx === void 0 ? void 0 : tx.hash)) {
                    callback({ code: Status.INTERNAL, message: "Failed to Add The Commitment Onchain" });
                    return;
                }
                callback(null, { success: true, message: "sucess", commitment: bytes32Value, txHash: tx === null || tx === void 0 ? void 0 : tx.hash });
            }
            catch (error) {
                console.log(error);
                callback({ code: Status.INTERNAL, message: "Internal Server Error" });
            }
        });
    },
    verifyClauseInclusion(call, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            let isProofValid;
            //This is for prod means for docker
            // const WASM_PATH: string = path.resolve(__dirname, "../../circomFiles/clauseInclusion/clauseInclusion.wasm");
            // const ZKEY_PATH: string = path.resolve(__dirname, "../../circomFiles/clauseInclusion/clauseInclusion_final.zkey");
            //this is for local
            const WASM_PATH = path.join(process.cwd(), "src/utils/circomFiles/clauseInclusion/clauseInclusion.wasm");
            const ZKEY_PATH = path.join(process.cwd(), "src/utils/circomFiles/clauseInclusion/clauseInclusion_final.zkey");
            try {
                const { agreementId, clauseSetHash, commitment } = call.request;
                if (!agreementId || !clauseSetHash || !commitment) {
                    callback({ code: Status.INVALID_ARGUMENT, message: "please provide agreementId,clauseSetHash,commitment" });
                    return;
                }
                const contract = yield getContractInstance(clauseInclusionAddress, clauseInclusionAbi);
                const contractCommitment = yield contract.clauseInclusionCommitments(agreementId);
                console.log("The commitment from user  we are getting is", commitment);
                console.log("the commitment from contract we are getting is", contractCommitment);
                const { a: A, b: B, c: C, inputSignals } = yield generateClauseInclusionProof({ agreementId, clauseSetHash, commitment: contractCommitment }, WASM_PATH, ZKEY_PATH);
                if (!A || !B || !C || !inputSignals) {
                    callback({ message: "Failed To Generate Proof", code: Status.NOT_FOUND });
                    return;
                }
                console.log("A", A);
                console.log("B", B);
                console.log("C", C);
                console.log("input signals", inputSignals);
                isProofValid = yield contract.verifyClauseInclusionCommitment(agreementId, A, B, C, inputSignals);
                console.log("the result we are getting is", isProofValid);
                callback(null, { success: true, message: "success", isValid: isProofValid });
            }
            catch (error) {
                // console.log(error);
                console.log("The error we are getting is", error);
                if (isZKPError(error)) {
                    callback({ message: error === null || error === void 0 ? void 0 : error.code, details: JSON.stringify({ isValid: false, success: false }), code: error.statusCode }, null);
                    return;
                }
                callback({ message: "Internal Server Error", code: Status.INTERNAL, details: JSON.stringify({ isValid: false, success: false }) }, null);
                return;
            }
        });
    },
    addBgExpiry(call, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { bgExpiry, POenddate, Ndays, bgId } = call.request;
                if (!bgExpiry || !POenddate || !Ndays || !bgId) {
                    return callback({ code: Status.INVALID_ARGUMENT, message: "please provide bgExpiry,POendate,Ndays,bgId" });
                }
                const commitment = yield getCommitmentHash(bgExpiry);
                const contract = yield getContractInstance(bgExpiryAddress, BGExpiryAbi);
                const tx = yield contract.registerBG(bgId, commitment);
                if (!(tx === null || tx === void 0 ? void 0 : tx.hash)) {
                    return callback({ code: Status.UNKNOWN, message: "failed to add commitment" });
                }
                callback(null, { success: true, message: "Commiment Added Sucessfully", txHash: tx === null || tx === void 0 ? void 0 : tx.hash, commitment });
            }
            catch (error) {
                console.log(error);
                return callback({ code: Status.INTERNAL, message: "Internal Server Error" });
            }
        });
    },
    bgExpiryCheck(call, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            let isProofValid;
            //This is for prod means docker
            // const WASM_PATH: string = path.resolve(__dirname, "../../circomFiles/bgExpiryCheck/bgExpiryCheck.wasm");
            // const ZKEY_PATH: string = path.resolve(__dirname, "../../circomFiles/bgExpiryCheck/bgExpiryCheck_final.zkey");
            // This is for local
            const WASM_PATH = path.join(process.cwd(), "src/utils/circomFiles/bgExpiryCheck/bgExpiryCheck.wasm");
            const ZKEY_PATH = path.join(process.cwd(), "src/utils/circomFiles/bgExpiryCheck/bgExpiryCheck_final.zkey");
            try {
                const { bgExpiry, NDays, POEndDate, bgExpiryHash } = call.request;
                if (!bgExpiry || !NDays || !POEndDate || !bgExpiryHash) {
                    callback({ code: Status.INVALID_ARGUMENT, message: "please provide bgExpiry,NDays,POEndDate,bgExpiryHash" });
                    return;
                }
                const { a: A, b: B, c: C, inputSignals } = yield generateBGExpiryCheckProof({ bg_expiry: bgExpiry, bg_expiry_hash: bgExpiryHash, N_days: NDays, PO_end_date: POEndDate }, WASM_PATH, ZKEY_PATH);
                if (!A || !B || !C || !inputSignals) {
                    callback({ code: Status.NOT_FOUND, message: "Failed To Generate Proof" });
                    return;
                }
                console.log("The public signals we are getting is ", inputSignals);
                const contract = yield getContractInstance(bgExpiryAddress, BGExpiryAbi);
                isProofValid = yield contract.verifyBG(A, B, C, inputSignals);
                console.log("the result we are getting is", isProofValid);
                callback(null, { isValid: isProofValid, message: "sucess", success: true });
            }
            catch (error) {
                console.log("The error we are getting is", error);
                if (isZKPError(error)) {
                    callback({ message: error === null || error === void 0 ? void 0 : error.code, details: JSON.stringify({ isValid: false, success: false }), code: error.statusCode }, null);
                    return;
                }
                callback({ message: "Internal Server Error", code: Status.INTERNAL, details: JSON.stringify({ isValid: false, success: false }) }, null);
                return;
            }
        });
    },
    addAmountWithRangeCommitment(call, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { invoiceTotal, poBalance, id } = call.request;
                if (!invoiceTotal || !poBalance || !id) {
                    return callback({ code: Status.INVALID_ARGUMENT, message: "please provide inoviceTotal, poBalance and id" });
                }
                const data = { poBalance };
                const commitment = yield getCommitmentHash(data);
                const contract = yield getContractInstance(amountWithinRangeAddress, AmountWithinRangeAbi);
                const tx = yield contract.addAmountWithinRangeCommitment(id, commitment);
                if (!(tx === null || tx === void 0 ? void 0 : tx.hash)) {
                    return callback({ code: Status.UNKNOWN, message: "failed to add commitment" });
                }
                return callback(null, { success: true, message: "Commitment Added Successfully", txHash: tx === null || tx === void 0 ? void 0 : tx.hash, commitment: commitment });
            }
            catch (error) {
                console.log(error);
                return callback({ code: Status.INTERNAL, message: "Internal Server Error" });
            }
        });
    },
    amountWithinRange(call, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            let isProofValid;
            //This is for prod means docker
            // const WASM_PATH: string = path.resolve(__dirname, "../../circomFiles/amountWithinRange/amountWithinRange.wasm");
            // const ZKEY_PATH: string = path.resolve(__dirname, "../../circomFiles/amountWithinRange/amountWithinRange_final.zkey");
            //This is for local
            const WASM_PATH = path.join(process.cwd(), "src/utils/circomFiles/amountWithinRange/amountWithinRange.wasm");
            const ZKEY_PATH = path.join(process.cwd(), "src/utils/circomFiles/amountWithinRange/amountWithinRange_final.zkey");
            try {
                const { invoiceTotal, poBalance, poBalanceHash } = call.request;
                if (!invoiceTotal || !poBalance || !poBalanceHash) {
                    callback({ code: Status.INVALID_ARGUMENT, message: "please provide invoiceTotal, poBalance, poBalanceHash" });
                    return;
                }
                const { a: A, b: B, c: C, inputSignals } = yield generateAmountWithinRangeProof({ invoiceTotal, poBalance, poBalance_hash: poBalanceHash }, WASM_PATH, ZKEY_PATH);
                if (!A || !B || !C || !inputSignals) {
                    callback({ code: Status.NOT_FOUND, message: "Failed To Generate Proof" });
                    return;
                }
                console.log("The public signals we are getting is ", inputSignals);
                const contract = yield getContractInstance(amountWithinRangeAddress, AmountWithinRangeAbi);
                isProofValid = yield contract.verifyAmoutWithinRangeCommitment(A, B, C, inputSignals);
                console.log("the result we are getting is", isProofValid);
                callback(null, { isValid: isProofValid, message: "success", success: true });
            }
            catch (error) {
                console.log("The error we are getting is", error);
                if (isZKPError(error)) {
                    callback({ message: error === null || error === void 0 ? void 0 : error.code, details: JSON.stringify({ isValid: false, success: false }), code: error.statusCode }, null);
                    return;
                }
                callback({ message: "Internal Server Error", code: Status.INTERNAL, details: JSON.stringify({ isValid: false, success: false }) }, null);
                return;
            }
        });
    }
};
