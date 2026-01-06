const successResponse = (res, statusCode, data) => {
    res.status(statusCode).send({
        message: "success",
        success: true,
        data,
    });
};
export default successResponse;
