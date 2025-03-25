import { Queue } from 'bullmq';
import { Redis } from 'ioredis';

const connection = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT || 6379),
});

export const logQueue = new Queue('log-processing-queue', {
    connection,
});
