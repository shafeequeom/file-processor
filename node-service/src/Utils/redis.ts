import { RedisOptions } from 'ioredis';
import Redis from 'ioredis'
import config from '../Common/Config/config';


export const createClient = (): RedisOptions => ({
    host: config.redis.host,
    port: Number(config.redis.port),
});


const redisPublisher = new Redis({
    host: config.redis.host,
    port: Number(config.redis.port),
});


redisPublisher.on('connect', () => {
    console.log('🔌 Redis publisher connected (node-service)');
});

redisPublisher.on('error', (err) => {
    console.error('❌ Redis publish error:', err);
});


export async function publishJobEvent(data: any) {
    await redisPublisher.publish('job-events', JSON.stringify(data));
    console.log('📤 Published to Redis:', data);

}