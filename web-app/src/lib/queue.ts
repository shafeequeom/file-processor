import { Queue } from 'bullmq';
import { redisConnection } from './redis';


export const logQueue = new Queue('log-processing-queue', {
    connection: redisConnection,
});
