import { Worker, QueueEvents } from 'bullmq';
import { processLogJob } from '../Jobs/logProcessor';
import { createClient } from '../Utils/redis';
import config from '../Common/Config/config';

export function startWorker(): void {
    const worker = new Worker(
        config.bullmq.queueName,
        processLogJob,
        {
            connection: createClient(),
            concurrency: config.bullmq.concurrency,
        }
    );

    const queueEvents = new QueueEvents(config.bullmq.queueName, {
        connection: createClient(),
    });

    worker.on('completed', (job) => {
        console.log(`✅ Job ${job.id} completed`);
    });

    worker.on('failed', (job, err) => {
        console.error(`❌ Job ${job?.id} failed:`, err);
    });

    queueEvents.on('waiting', ({ jobId }) => {
        console.log(`⏳ Job ${jobId} is waiting in the queue`);
    });

    console.log(`📦 BullMQ Worker started for queue: ${config.bullmq.queueName}`);
}
