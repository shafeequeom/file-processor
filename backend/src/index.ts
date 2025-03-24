
import { App } from "./app";


class Server {

    public express: App;

    constructor() {
        this.connectToDatabase();
        this.express = new App();

    }

    private connectToDatabase() {

    }

}


new Server()