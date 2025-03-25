
import { App } from "./app";
import { startWorker } from './Worker'


class Server {

    public express: App;

    constructor() {
        this.express = new App();
        startWorker();
    }

}


new Server()