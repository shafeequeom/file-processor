import cluster from "node:cluster";
import { cpus } from "node:os";
import { Server } from "./server"; // Assuming you renamed your class file to `server.ts`

const numCPUs = cpus().length;

if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);

    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    // Restart on worker crash
    cluster.on("exit", (worker, code, signal) => {
        console.warn(`Worker ${worker.process.pid} died. Restarting...`);
        cluster.fork();
    });
} else {
    console.log(`Worker ${process.pid} started`);
    new Server(); // Starts both Express and BullMQ worker
}
