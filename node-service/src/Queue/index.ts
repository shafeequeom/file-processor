import { Queue } from 'bullmq';
import { createClient } from '../Utils/redis';
import config from '../Common/Config/config';

const queueName = config.bullmq.queueName || 'log-processing-queue';

export const logQueue = new Queue(queueName, {
    connection: createClient(),
});
