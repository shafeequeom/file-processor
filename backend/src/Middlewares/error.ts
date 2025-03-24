import httpStatus from "http-status";
import { Request, Response, NextFunction } from 'express';
import ApiError from "../Common/Utils/ApiError";
import { APICodes } from "../Common/Constants";
import { logger } from "../Common/Utils/logger";

export class ErrorHandler {
    errorConverter(err: any, req: Request, res: Response, next: NextFunction) {
        let error = err;
        if (!(error instanceof ApiError)) {
            const statusCode = error.statusCode;
            const code = APICodes.UNKNOWN_ERROR.code;
            const statusCodes: any = httpStatus
            const message = error.message || statusCodes[statusCode];
            error = new ApiError(statusCode, message, code, false, err.stack);
        }
        next(error);
    }

    // eslint-disable-next-line no-unused-vars
    errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
        let { statusCode, message, code } = err;

        res.locals.errorMessage = err.message;

        const response = {
            status: false,
            message,
            code,
            data: err.stack
        };

        logger.error(err);


        res.status(statusCode).send(response);
    };

}
