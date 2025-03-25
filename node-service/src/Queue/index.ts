import { Queue } from 'bullmq';
import { createClient } from '../Utils/redis';

const queueName = process.env.BULLMQ_QUEUE_NAME || 'log-processing-queue';

export const logQueue = new Queue(queueName, {
    connection: createClient(),
});
