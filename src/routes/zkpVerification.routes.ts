import { FastifyInstance } from "fastify";
import { amountWithinRangeVerification, bgExpiryCheckVerification, clauseInclusionVerification, healthRoute } from "../../controllers/zkpVerification.controllers";

const clauseInclusionRoutes = (fastify: FastifyInstance) => {

    fastify.get("/", healthRoute);
    fastify.post("/clauseInclusion/verify", clauseInclusionVerification);
    fastify.post("/bgExpiryCheck/verify", bgExpiryCheckVerification);
    fastify.post("/amountWithinRange/verify", amountWithinRangeVerification);


}

export default clauseInclusionRoutes;

