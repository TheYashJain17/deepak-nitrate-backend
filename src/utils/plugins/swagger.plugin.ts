import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";

export default fp(async (fastify: FastifyInstance) => {

    await fastify.register(swagger, {

        openapi: {

            info: {

                title: "ZKP Verification API",
                description: "API Documentation For ZKP Verification",
                version: "1.0.0"

            },
            servers: [

                {

                    url: "http://localhost:8002",

                },

            ],

        },

    });

    await fastify.register(swaggerUI, { routePrefix: "/docs" })


})

