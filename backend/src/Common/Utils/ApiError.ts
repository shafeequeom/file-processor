class ApiError extends Error {
    isOperational: boolean;
    statusCode: number;
    code:string;
    constructor(statusCode: number, message: string, code:string="", isOperational: boolean = true, stack: string = '') {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.code = code
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default ApiError;