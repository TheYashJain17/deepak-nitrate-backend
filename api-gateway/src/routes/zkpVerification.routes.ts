// import { FastifyInstance } from "fastify";
// import { amountWithinRangeVerification, bgExpiryCheckVerification, clauseInclusionVerification, healthRoute } from "../../controllers/zkpVerification.controllers";

// const clauseInclusionRoutes = (fastify: FastifyInstance) => {

//     fastify.get("/", healthRoute);
//     fastify.post("/clauseInclusion/verify", clauseInclusionVerification);
//     fastify.post("/bgExpiryCheck/verify", bgExpiryCheckVerification);
//     fastify.post("/amountWithinRange/verify", amountWithinRangeVerification);


// }

// export default clauseInclusionRoutes;




import { FastifyInstance } from "fastify";
import {
    addBgExpiryCommitment,
    addClauseInclusionCommitment,
    amountWithinRangeVerification,
    bgExpiryCheckVerification,
    clauseInclusionVerification,
    healthRoute,
} from "../../controllers/zkpVerification.controllers.js";
import { ErrorResponse, SuccessResponse } from "../schemas/shared/response.schema.js";
import { ClauseInclusionBody } from "../schemas/zkp/clauseInclusion.schema.js";
import { BGExpiryCheckBody } from "../schemas/zkp/bgExpiryCheck.schema.js";
import { AmountWithinRangeBody } from "../schemas/zkp/amountWithinRange.schema.js";

const zkpVerificationRoutes = async (fastify: FastifyInstance) => {


    fastify.get(
        "/",
        {
            schema: {
                tags: ["Health"],
                summary: "Health check endpoint",
                response: {
                    200: SuccessResponse,
                    500: ErrorResponse
                },
            },
        },
        healthRoute
    );

    fastify.post(

        "/clauseInclusion/addCommitment",
        addClauseInclusionCommitment

    )

    fastify.post(
        "/clauseInclusion/verify",
        {
            schema: {
                tags: ["ZKP Verification"],
                summary: "Verify clause inclusion using ZKP",
                body: ClauseInclusionBody,
                response: {
                    200: SuccessResponse,
                    400: ErrorResponse,
                    500: ErrorResponse
                },
            },
        },
        clauseInclusionVerification
    );


    fastify.post(

        "/bgExpiryCheck/addCommitment",
        addBgExpiryCommitment

    )


    fastify.post(
        "/bgExpiryCheck/verify",
        {
            schema: {
                tags: ["ZKP Verification"],
                summary: "Verify BG expiry using ZKP",
                body: BGExpiryCheckBody,
                response: {
                    200: SuccessResponse,
                    400: ErrorResponse,
                    500: ErrorResponse,
                },
            },
        },
        bgExpiryCheckVerification
    );

    fastify.post(
        "/amountWithinRange/verify",
        {
            schema: {
                tags: ["ZKP Verification"],
                summary: "Verify amount is within allowed range using ZKP",
                body: AmountWithinRangeBody,
                response: {
                    200: SuccessResponse,
                    400: ErrorResponse,
                    500: ErrorResponse
                },
            },
        },
        amountWithinRangeVerification
    );
};

export default zkpVerificationRoutes;
