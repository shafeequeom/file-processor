import { Request, Response, NextFunction } from "express";



export class AuthMiddleware {

    auth() {
        return async (req: Request, res: Response, next: NextFunction) => {
            return next();
        }
    }
}


