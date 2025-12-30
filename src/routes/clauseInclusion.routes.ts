import { FastifyInstance } from "fastify";
import { clauseInclusionVerification } from "../../controllers/clauseInclusion.controllers";

const clauseInclusionRoutes = (fastify: FastifyInstance) => {

    fastify.post("/clauseInclusion/verify", clauseInclusionVerification);

}

export default clauseInclusionRoutes;

