import { Response, Request } from "express";
import morgan from "morgan";
import config from "../Config/config";
import { logger } from "./logger";

morgan.token('message', (req: Request, res: Response) => res.locals.errorMessage || '');

const getIpFormat = () => (config.env === 'production' ? ':remote-addr - ' : '');
const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`;


export class Morgan {
    public successHandler = morgan(successResponseFormat, {
        skip: (req: Request, res: Response) => res.statusCode >= 400,
        stream: { write: (message: string) => logger.info(message.trim()) },
    })

    public errorHandler = morgan(errorResponseFormat, {
        skip: (req: Request, res: Response) => res.statusCode < 400,
        stream: { write: (message: string) => logger.error(message.trim()) },
    });
}
