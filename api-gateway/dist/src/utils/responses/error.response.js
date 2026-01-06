const errorResponse = (res, statusCode, data) => {
    res.status(statusCode).send({
        message: "failed",
        success: false,
        data,
    });
};
export default errorResponse;
