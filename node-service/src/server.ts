
import { App } from "./app";
import { startWorker } from './Worker'


export class Server {

    public express: App;

    constructor() {
        this.express = new App();
        startWorker();
    }

}


