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
const zkpVerificationRoutes = (fastify) => __awaiter(void 0, void 0, void 0, function* () {
    fastify.get("/", {
        schema: {
            tags: ["Health"],
            summary: "Health check endpoint",
            response: {
                200: {
                    type: "object",
                    properties: {
                        message: { type: "string" },
                        success: { type: "boolean" },
                        data: { type: "string" },
                    },
                },
                500: {
                    type: "object",
                    properties: {
                        message: { type: "string" },
                        success: { type: "boolean" },
                        data: { type: "string" },
                    },
                },
            },
        },
    }, healthRoute);
    fastify.post("/clauseInclusion/verify", {
        schema: {
            tags: ["ZKP Verification"],
            summary: "Verify clause inclusion using ZKP",
            body: {
                type: "object",
                required: ["agreementId", "clauseSetHash", "commitment"],
                properties: {
                    agreementId: { type: "string" },
                    clauseSetHash: { type: "string" },
                    commitment: { type: "string" },
                },
            },
            response: {
                200: {
                    type: "object",
                    properties: {
                        message: { type: "string" },
                        success: { type: "boolean" },
                        data: {
                            type: "object",
                            additionalProperties: true,
                        },
                    },
                },
                400: {
                    type: "object",
                    properties: {
                        message: { type: "string" },
                        success: { type: "boolean" },
                        data: { type: "string" },
                    },
                },
                500: {
                    type: "object",
                    properties: {
                        message: { type: "string" },
                        success: { type: "boolean" },
                        data: {
                            type: "object",
                            additionalProperties: true,
                        },
                    },
                },
            },
        },
    }, clauseInclusionVerification);
    fastify.post("/bgExpiryCheck/verify", {
        schema: {
            tags: ["ZKP Verification"],
            summary: "Verify BG expiry using ZKP",
            body: {
                type: "object",
                required: ["NDays", "POEndDate", "bgExpiry", "bgExpiryHash"],
                properties: {
                    NDays: { type: "string" },
                    POEndDate: { type: "string" },
                    bgExpiry: { type: "string" },
                    bgExpiryHash: { type: "string" },
                },
            },
            response: {
                200: {
                    type: "object",
                    properties: {
                        message: { type: "string" },
                        success: { type: "boolean" },
                        data: {
                            type: "object",
                            additionalProperties: true,
                        },
                    },
                },
                400: {
                    type: "object",
                    properties: {
                        message: { type: "string" },
                        success: { type: "boolean" },
                        data: { type: "string" },
                    },
                },
                500: {
                    type: "object",
                    properties: {
                        message: { type: "string" },
                        success: { type: "boolean" },
                        data: { type: "object", additionalProperties: true },
                    },
                },
            },
        },
    }, bgExpiryCheckVerification);
    fastify.post("/amountWithinRange/verify", {
        schema: {
            tags: ["ZKP Verification"],
            summary: "Verify amount is within allowed range using ZKP",
            body: {
                type: "object",
                required: ["invoiceTotal", "poBalance", "poBalanceHash"],
                properties: {
                    invoiceTotal: { type: "string" },
                    poBalance: { type: "string" },
                    poBalanceHash: { type: "string" },
                },
            },
            response: {
                200: {
                    type: "object",
                    properties: {
                        message: { type: "string" },
                        success: { type: "boolean" },
                        data: {
                            type: "object",
                            additionalProperties: true,
                        },
                    },
                },
                400: {
                    type: "object",
                    properties: {
                        message: { type: "string" },
                        success: { type: "boolean" },
                        data: { type: "string" },
                    },
                },
                500: {
                    type: "object",
                    properties: {
                        message: { type: "string" },
                        success: { type: "boolean" },
                        data: { type: "object", additionalProperties: true },
                    },
                },
            },
        },
    }, amountWithinRangeVerification);
});
export default zkpVerificationRoutes;
