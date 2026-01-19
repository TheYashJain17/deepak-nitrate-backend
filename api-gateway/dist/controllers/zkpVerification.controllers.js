var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import errorResponse from "../src/utils/responses/error.response.js";
import zkpVerificationClient from "../src/grpc/clients/zkpVerification.client.js";
import { getGrpcToHttpStatus } from "../src/utils/utilities/getHTTPStatusCode.js";
import successResponse from "../src/utils/responses/success.response.js";
import Fastify from "../src/app.js";
export const healthRoute = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        successResponse(res, 200, "Goodbye World");
    }
    catch (error) {
        console.log(error);
        errorResponse(res, 500, "Internal Server Error");
        return;
    }
});
export const addClauseInclusionCommitment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { agreementId, clauseSetHash } = req.body;
        if (!clauseSetHash || !agreementId) {
            errorResponse(res, 400, "please provide clauseSetHash, agreementId");
            return;
        }
        const response = yield new Promise((resolve, reject) => {
            zkpVerificationClient.AddClauseInclusionCommitment({ agreementId, clauseSetHash }, (err, success) => {
                var _a;
                if (err) {
                    const httpCode = getGrpcToHttpStatus(err.code);
                    const match = (_a = err === null || err === void 0 ? void 0 : err.message) === null || _a === void 0 ? void 0 : _a.match(/{.*}/);
                    if (match) {
                        errorResponse(res, httpCode, JSON.parse(match[0]));
                        return;
                    }
                    errorResponse(res, httpCode, err.message);
                    reject(err);
                    return;
                }
                Fastify.log.fatal(success);
                resolve(success);
            });
        });
        successResponse(res, 201, response);
    }
    catch (error) {
        console.log(error);
        errorResponse(res, 500, "Internal Server Error");
    }
});
export const clauseInclusionVerification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { agreementId, clauseSetHash, commitment } = req.body;
        if (!agreementId || !clauseSetHash || !commitment) {
            errorResponse(res, 400, "please provide agreementId, clauseSetHash,commitment");
            return;
        }
        const response = yield new Promise((resolve, reject) => {
            zkpVerificationClient.VerifyClauseInclusion({ agreementId, clauseSetHash, commitment }, (err, success) => {
                var _a;
                if (err) {
                    const httpCode = getGrpcToHttpStatus(err.code);
                    const match = (_a = err === null || err === void 0 ? void 0 : err.message) === null || _a === void 0 ? void 0 : _a.match(/{.*}/);
                    if (match) {
                        errorResponse(res, httpCode, JSON.parse(match[0]));
                        return;
                    }
                    errorResponse(res, httpCode, err.message);
                    reject(err);
                    return;
                }
                console.log(`The data getting from microservice is from console is`, success);
                resolve(success);
            });
        });
        successResponse(res, 200, response);
    }
    catch (error) {
        console.log(error);
        errorResponse(res, 500, "Internal Server Error");
        return;
    }
});
export const addBgExpiryCommitment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { Ndays, POenddate, bgExpiry, bgId } = req.body;
        if (!Ndays || !POenddate || !bgExpiry || !bgId) {
            return errorResponse(res, 400, "please provide Ndays,POenddata,bgExpiry,bgId");
        }
        const response = yield new Promise((resolve, reject) => {
            zkpVerificationClient.AddBGExpiry({ POenddate, Ndays, bgExpiry, bgId }, (err, success) => {
                var _a;
                if (err) {
                    const httpCode = getGrpcToHttpStatus(err.code);
                    const match = (_a = err === null || err === void 0 ? void 0 : err.message) === null || _a === void 0 ? void 0 : _a.match(/{.*}/);
                    if (match) {
                        errorResponse(res, httpCode, JSON.parse(match[0]));
                        return;
                    }
                    errorResponse(res, httpCode, err.message);
                    reject(err);
                    return;
                }
                console.log("The response we are getting is", success);
                resolve(success);
            });
        });
        successResponse(res, 201, response);
    }
    catch (error) {
        console.log(error);
        return errorResponse(res, 500, "Internal Server Error");
    }
});
export const bgExpiryCheckVerification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { NDays, POEndDate, bgExpiry, bgExpiryHash } = req.body;
        if (!NDays || !POEndDate || !bgExpiry || !bgExpiryHash) {
            errorResponse(res, 400, "please provide NDays,POEndDate,bgExpiry,bgExpiryHash");
            return;
        }
        const response = yield new Promise((resolve, reject) => {
            zkpVerificationClient.BGExpiryCheck({ NDays, POEndDate, bgExpiry, bgExpiryHash }, (err, success) => {
                var _a;
                if (err) {
                    const httpCode = getGrpcToHttpStatus(err.code);
                    const match = (_a = err === null || err === void 0 ? void 0 : err.message) === null || _a === void 0 ? void 0 : _a.match(/{.*}/);
                    if (match) {
                        errorResponse(res, httpCode, JSON.parse(match[0]));
                        return;
                    }
                    errorResponse(res, httpCode, err.message);
                    reject(err);
                    return;
                }
                console.log(`The data getting from microservice is from console is`, success);
                resolve(success);
            });
        });
        successResponse(res, 200, response);
    }
    catch (error) {
        console.log(error);
        errorResponse(res, 500, "Internal Server Error");
    }
});
export const addAmountWithinRangeCommitment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, invoiceTotal, poBalance } = req.body;
        if (!id || !invoiceTotal || !poBalance) {
            return errorResponse(res, 400, "please provide id,invoiceTotal and poBalance");
        }
        const response = yield new Promise((resolve, reject) => {
            zkpVerificationClient.AddAmountWithRangeCommitment({ id, invoiceTotal, poBalance }, (err, success) => {
                var _a;
                if (err) {
                    const httpCode = getGrpcToHttpStatus(err.code);
                    const match = (_a = err === null || err === void 0 ? void 0 : err.message) === null || _a === void 0 ? void 0 : _a.match(/{.*}/);
                    if (match) {
                        errorResponse(res, httpCode, JSON.parse(match[0]));
                        return;
                    }
                    errorResponse(res, httpCode, err.message);
                    reject(err);
                    return;
                }
                resolve(success);
            });
        });
        successResponse(res, 201, response);
    }
    catch (error) {
        console.log(error);
        return errorResponse(res, 500, "Internal Server Error");
    }
});
export const amountWithinRangeVerification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { invoiceTotal, poBalance, poBalanceHash } = req.body;
        if (!invoiceTotal || !poBalance || !poBalanceHash) {
            errorResponse(res, 400, "please provide invoiceTotal, poBalance, poBalanceHash");
            return;
        }
        const response = yield new Promise((resolve, reject) => {
            zkpVerificationClient.AmountWithinRange({ invoiceTotal, poBalance, poBalanceHash }, (err, success) => {
                var _a;
                if (err) {
                    const httpCode = getGrpcToHttpStatus(err.code);
                    const match = (_a = err === null || err === void 0 ? void 0 : err.message) === null || _a === void 0 ? void 0 : _a.match(/{.*}/);
                    if (match) {
                        errorResponse(res, httpCode, JSON.parse(match[0]));
                        return;
                    }
                    errorResponse(res, httpCode, err.message);
                    reject(err);
                    return;
                }
                console.log(`The data getting from microservice is from console is`, success);
                resolve(success);
            });
        });
        successResponse(res, 200, response);
    }
    catch (error) {
        console.log(error);
        errorResponse(res, 500, "Internal Server Error");
    }
});
