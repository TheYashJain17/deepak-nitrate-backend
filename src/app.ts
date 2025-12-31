import fastify from "fastify";
import cors from "@fastify/cors";
import zkpVerificationRoutes from "./routes/zkpVerification.routes";

const Fastify = fastify({logger: true});

Fastify.register(cors, {

    origin:"*",

});

Fastify.register(zkpVerificationRoutes, {prefix: "/api/v1/zkp"});

export default Fastify;