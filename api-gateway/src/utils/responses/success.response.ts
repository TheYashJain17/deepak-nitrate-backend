import { FastifyReply } from "fastify";

const successResponse = (res: FastifyReply, statusCode: number, data: string | [] | object) => {

    res.status(statusCode).send({

        message: "success",
        success: true,
        data,
    })

}

export default successResponse;