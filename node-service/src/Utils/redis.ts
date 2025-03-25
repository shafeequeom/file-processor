import { RedisOptions } from 'ioredis';
import config from '../Common/Config/config';


export const createClient = (): RedisOptions => ({
    host: config.redis.host,
    port: Number(config.redis.port),
});
