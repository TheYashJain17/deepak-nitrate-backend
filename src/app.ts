import fastify from "fastify";
import cors from "@fastify/cors";
import clauseInclusionRoutes from "./routes/clauseInclusion.routes";

const Fastify = fastify({logger: true});

Fastify.register(cors, {

    origin:"*",

});

Fastify.register(clauseInclusionRoutes, {prefix: "/api/v1/zkp"});

export default Fastify;