import { FastifyInstance } from "fastify";
import { clauseInclusionVerification, healthRoute } from "../../controllers/zkpVerification.controllers";

const clauseInclusionRoutes = (fastify: FastifyInstance) => {

    fastify.get("/", healthRoute);
    fastify.post("/clauseInclusion/verify", clauseInclusionVerification);


}

export default clauseInclusionRoutes;

