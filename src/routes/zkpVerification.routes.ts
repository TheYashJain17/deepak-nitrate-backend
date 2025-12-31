import { FastifyInstance } from "fastify";
import { bgExpiryCheckVerification, clauseInclusionVerification, healthRoute } from "../../controllers/zkpVerification.controllers";

const clauseInclusionRoutes = (fastify: FastifyInstance) => {

    fastify.get("/", healthRoute);
    fastify.post("/clauseInclusion/verify", clauseInclusionVerification);
    fastify.post("/bgExpiryCheck/verify", bgExpiryCheckVerification);


}

export default clauseInclusionRoutes;

