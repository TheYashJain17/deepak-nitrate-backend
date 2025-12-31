import { FastifyReply, FastifyRequest } from "fastify";
import errorResponse from "../src/utils/responses/error.response";
import { AmountWithinRangeRequest, AmountWithinRangeResponse, BGExpiryCheckRequest, BGExpiryCheckResponse, VerifyClauseInclusionRequest, VerifyClauseInclusionResponse } from "../types/zkpVerification.types";
import zkpVerificationClient from "../src/grpc/clients/zkpVerification.client";
import grpc from "@grpc/grpc-js";
import { getGrpcToHttpStatus } from "../src/utils/utilities/getHTTPStatusCode";
import successResponse from "../src/utils/responses/success.response";

export const healthRoute = async (req: FastifyRequest, res: FastifyReply) => {
    []

    try {

        successResponse(res, 200, "Goodbye World")

    } catch (error) {

        console.log(error);

        errorResponse(res, 500, "Internal Server Error");

        return;

    }

}

export const clauseInclusionVerification = async (req: FastifyRequest, res: FastifyReply) => {

    try {

        const { agreementId, clauseSetHash, commitment } = req.body as VerifyClauseInclusionRequest;

        if (!agreementId || !clauseSetHash || !commitment) {

            errorResponse(res, 400, "please provide agreementId, clauseSetHash,commitment");
            return;

        }

        const response = await new Promise((resolve, reject) => {

            zkpVerificationClient.VerifyClauseInclusion({ agreementId, clauseSetHash, commitment }, (err: grpc.ServiceError, success: VerifyClauseInclusionResponse) => {

                if (err) {

                    const httpCode = getGrpcToHttpStatus(err.code);

                    const match = err?.message?.match(/{.*}/)
                    if (match) {

                        errorResponse(res, httpCode, JSON.parse(match[0]));
                        return;

                    }

                    errorResponse(res, httpCode, err.message);
                    reject(err);
                    return

                }

                console.log(`The data getting from microservice is from console is`, success);
                resolve(success);


            })
        })

        successResponse(res, 200, response as VerifyClauseInclusionResponse);

    } catch (error) {

        console.log(error);

        errorResponse(res, 500, "Internal Server Error");
        return;

    }

}

export const bgExpiryCheckVerification = async (req: FastifyRequest, res: FastifyReply) => {

    try {

        const { NDays, POEndDate, bgExpiry, bgExpiryHash } = req.body as BGExpiryCheckRequest;

        if (!NDays || !POEndDate || !bgExpiry || !bgExpiryHash) {

            errorResponse(res, 400, "please provide NDays,POEndDate,bgExpiry,bgExpiryHash");
            return;

        }

        const response = await new Promise((resolve, reject) => {

            zkpVerificationClient.BGExpiryCheck({ NDays, POEndDate, bgExpiry, bgExpiryHash }, (err: grpc.ServiceError, success: BGExpiryCheckResponse) => {

                if (err) {

                    const httpCode = getGrpcToHttpStatus(err.code);

                    const match = err?.message?.match(/{.*}/)
                    if (match) {

                        errorResponse(res, httpCode, JSON.parse(match[0]));
                        return;

                    }

                    errorResponse(res, httpCode, err.message);
                    reject(err);
                    return

                }

                console.log(`The data getting from microservice is from console is`, success);
                resolve(success);


            })
        })

        successResponse(res, 200, response as BGExpiryCheckResponse);


    } catch (error) {

        console.log(error);

        errorResponse(res, 500, "Internal Server Error");

    }

}

export const amountWithinRangeVerification = async (req: FastifyRequest, res: FastifyReply) => {

    try {

        const { invoiceTotal, poBalance, poBalanceHash } = req.body as AmountWithinRangeRequest;

        if (!invoiceTotal || !poBalance || poBalanceHash) {

            errorResponse(res, 400, "please provide invoiceTotal, poBalance, poBalanceHash");
            return;

        }

        const response = await new Promise((resolve, reject) => {

            zkpVerificationClient.AmountWithinRange({ invoiceTotal, poBalance, poBalanceHash }, (err: grpc.ServiceError, success: AmountWithinRangeResponse) => {

                if (err) {

                    const httpCode = getGrpcToHttpStatus(err.code);

                    const match = err?.message?.match(/{.*}/)
                    if (match) {

                        errorResponse(res, httpCode, JSON.parse(match[0]));
                        return;

                    }

                    errorResponse(res, httpCode, err.message);
                    reject(err);
                    return

                }

                console.log(`The data getting from microservice is from console is`, success);
                resolve(success);


            })

        })

        successResponse(res,200,response as AmountWithinRangeResponse);

    } catch (error) {

        console.log(error);

        errorResponse(res, 500, "Internal Server Error");

    }

}