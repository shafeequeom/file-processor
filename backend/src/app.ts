import express, { Request, Response, NextFunction } from "express";
import cors from 'cors';
import compression from "compression";
import router from './route';
import { ErrorHandler } from "./Middlewares/error";
import ApiError from "./Common/Utils/ApiError";
const { errorHandler, errorConverter } = new ErrorHandler();
import httpStatus from "http-status";
import { Morgan } from './Common/Utils/morgan';
import config from './Common/Config/config';


export class App {
    public app: express.Application;
    public morgan: Morgan;
    public config = config;

    constructor() {
        this.app = express();
        this.morgan = new Morgan();
        this.middleware();
        this.routes();
        this.listenServer()

    }

    private middleware(): void {

        if (this.config.env !== 'test') {
            this.app.use(this.morgan.successHandler);
            this.app.use(this.morgan.errorHandler);
        }

        // enable cors
        this.app.use(cors());

        //json
        this.app.use(express.json());

        // gzip compression
        this.app.use(compression());

    }

    private routes(): void {
        this.app.use('/api', router)

        this.app.use((req: Request, res: Response, next: NextFunction) => {
            console.log("Path: " + req.path);
            next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
        });

        // convert error to ApiError, if needed
        this.app.use(errorConverter);

        // handle error
        this.app.use(errorHandler);
    }

    private listenServer() {
        this.app.listen(config.port, () => {
            console.log(`Server running on port ${config.port}`);
        })
    }
}