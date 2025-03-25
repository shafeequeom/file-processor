import express, { Request, Response, NextFunction } from "express";
import cors from 'cors';
import httpStatus from "http-status";
import config from './Common/Config/config';


export class App {
    public app: express.Application;
    public config = config;

    constructor() {
        this.app = express();
        this.middleware();
        this.routes();
        this.listenServer()
    }

    private middleware(): void {
        // enable cors
        this.app.use(cors());
    }

    private routes(): void {
        this.app.use('/status-check', (req: Request, res: Response) => {
            res.send({ message: "Server is running" });
        });

        this.app.use((req: Request, res: Response, next: NextFunction) => {
            res.status(httpStatus.NOT_FOUND).send('Not Found');
        });
    }

    private listenServer() {
        this.app.listen(config.port, () => {
            console.log(`Server running on port ${config.port}`);
        })
    }
}