import Redis from "ioredis";

export const redisConnection = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT || 6379),
});

// Publisher client (used to send messages)
export const pub = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
});

// Subscriber client (used to listen to messages)
export const sub = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
});

pub.on('connect', () => console.log('🔌 Redis publisher connected'));
sub.on('connect', () => console.log('🔌 Redis subscriber connected'));

pub.on('error', (err) => console.error('❌ Redis Pub Error:', err));
sub.on('error', (err) => console.error('❌ Redis Sub Error:', err));
