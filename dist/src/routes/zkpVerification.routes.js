// import { FastifyInstance } from "fastify";
// import { amountWithinRangeVerification, bgExpiryCheckVerification, clauseInclusionVerification, healthRoute } from "../../controllers/zkpVerification.controllers";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { amountWithinRangeVerification, bgExpiryCheckVerification, clauseInclusionVerification, healthRoute, } from "../../controllers/zkpVerification.controllers.js";
import { ErrorResponse, SuccessResponse } from "../schemas/shared/response.schema.js";
import { ClauseInclusionBody } from "../schemas/zkp/clauseInclusion.schema.js";
import { BGExpiryCheckBody } from "../schemas/zkp/bgExpiryCheck.schema.js";
import { AmountWithinRangeBody } from "../schemas/zkp/amountWithinRange.schema.js";
const zkpVerificationRoutes = (fastify) => __awaiter(void 0, void 0, void 0, function* () {
    fastify.get("/", {
        schema: {
            tags: ["Health"],
            summary: "Health check endpoint",
            response: {
                200: SuccessResponse,
                500: ErrorResponse
            },
        },
    }, healthRoute);
    fastify.post("/clauseInclusion/verify", {
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
    }, clauseInclusionVerification);
    fastify.post("/bgExpiryCheck/verify", {
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
    }, bgExpiryCheckVerification);
    fastify.post("/amountWithinRange/verify", {
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
    }, amountWithinRangeVerification);
});
export default zkpVerificationRoutes;
