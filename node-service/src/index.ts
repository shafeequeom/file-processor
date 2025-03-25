
import { App } from "./app";


class Server {

    public express: App;

    constructor() {
        this.express = new App();
    }

}


new Server()