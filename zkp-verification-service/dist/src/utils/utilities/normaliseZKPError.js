const normalizeZkpError = (error) => {
    let message = "";
    if (error instanceof Error) {
        message = error.message;
    }
    else if (typeof error === "string") {
        message = error;
    }
    if (message.includes("Assert Failed") ||
        message.includes("Error in template") ||
        message.includes("Constraint")) {
        return {
            code: "INVALID_PROOF_INPUT",
            userMessage: "The provided inputs do not satisfy the verification rules. Please check that the commitment was generated correctly.",
            statusCode: 400
        };
    }
    if (message.includes("witness")) {
        return {
            code: "WITNESS_GENERATION_FAILED",
            userMessage: "Unable to generate proof due to invalid input values.",
            statusCode: 400
        };
    }
    return {
        code: "ZKP_INTERNAL_ERROR",
        userMessage: "An internal verification error occurred. Please try again later.",
        statusCode: 500
    };
};
export default normalizeZkpError;
