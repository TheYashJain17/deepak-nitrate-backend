import { FastifyReply, FastifyRequest } from "fastify";
import errorResponse from "../src/utils/responses/error.response";
import { VerifyClauseInclusionRequest, VerifyClauseInclusionResponse } from "../types/clauseInclusion.types";
import clauseInclusionClient from "../src/grpc/clients/clauseInclusion.client";
import grpc from "@grpc/grpc-js";
import { getGrpcToHttpStatus } from "../src/utils/utilities/getHTTPStatusCode";
import successResponse from "../src/utils/responses/success.response";

export const healthRoute = async(req: FastifyRequest, res: FastifyReply) => {[]

    try {
        
        successResponse(res,200,"Goodbye World")

    } catch (error) {

        console.log(error);

        errorResponse(res,500,"Internal Server Error");

        return;
        
    }

}

export const clauseInclusionVerification = async(req: FastifyRequest, res: FastifyReply) => {

    try {

        const {agreementId, clauseSetHash,commitment} = req.body as VerifyClauseInclusionRequest;

        if(!agreementId || !clauseSetHash || !commitment){

            errorResponse(res, 400, "please provide agreementId, clauseSetHash,commitment");
            return;

        }

        const response = await new Promise((resolve, reject) => {

            clauseInclusionClient.VerifyClauseInclusion({agreementId, clauseSetHash, commitment}, (err: grpc.ServiceError, success: VerifyClauseInclusionResponse) => {

                if(err){

                    const httpCode = getGrpcToHttpStatus(err.code);

                    errorResponse(res, httpCode, err.message);
                    reject(err);
                    return

                }

                console.log(`The data getting from microservice is from console is`, success);
                resolve(success);


            })
        })

        successResponse(res,200,response as VerifyClauseInclusionResponse);
        
    } catch (error) {

        console.log(error);

        errorResponse(res, 500,"Internal Server Error");
        return;
        
    }

}