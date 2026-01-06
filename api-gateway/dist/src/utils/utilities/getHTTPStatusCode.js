export const getGrpcToHttpStatus = (code) => {
    switch (code) {
        case 0: return 200; // OK
        case 3: return 400; // INVALID_ARGUMENT
        case 5: return 404; // NOT_FOUND
        case 16: return 401; // UNAUTHENTICATED
        case 13: return 500; // INTERNAL
        default: return 500; // fallback
    }
};
