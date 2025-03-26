import dotenv from 'dotenv';
import path from 'path';
import Joi from 'joi';

dotenv.config({ path: path.join(__dirname, '../../../.env') });

function getValidationObject() {

    const JoiValidationContent: any = {
        NODE_ENV: Joi.string().valid('production', 'development', 'test', 'dev').required(),
        PORT: Joi.number().default(3001),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().default(6379),
        BULLMQ_QUEUE_NAME: Joi.string().default('log-processing-queue'),
        BULLMQ_CONCURRENCY: Joi.number().default(4),
        KEYWORDS: Joi.string().default('ERROR,FAIL,EXCEPTION'),
    };

    return JoiValidationContent;
}

const envVarsSchema = Joi.object()
    .keys(getValidationObject())
    .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

export default {
    /** Base configuration */
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    /** Redis configuration */
    redis: {
        host: envVars.REDIS_HOST,
        port: envVars.REDIS_PORT,
    },
    /** BullMQ configuration */
    bullmq: {
        queueName: envVars.BULLMQ_QUEUE_NAME,
        concurrency: envVars.BULLMQ_CONCURRENCY,
    },
    /** Log processing configuration */
    keywords: envVars.KEYWORDS,
};
