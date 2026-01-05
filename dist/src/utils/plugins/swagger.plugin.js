var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fp from "fastify-plugin";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
export default fp((fastify) => __awaiter(void 0, void 0, void 0, function* () {
    yield fastify.register(swagger, {
        openapi: {
            info: {
                title: "ZKP Verification API",
                description: "API Documentation For ZKP Verification",
                version: "1.0.0"
            },
            servers: [
                {
                    url: "http://localhost:8000",
                },
            ],
        },
    });
    yield fastify.register(swaggerUI, { routePrefix: "/docs" });
}));
