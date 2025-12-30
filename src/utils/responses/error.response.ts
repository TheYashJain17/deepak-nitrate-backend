import { FastifyReply } from "fastify";

const errorResponse = (res: FastifyReply, statusCode: number, data: string | [] | object) => {

    res.status(statusCode).send({

        message: "failed",
        success: false,
        data,
    })

}

export default errorResponse;