import dotenv from 'dotenv';
import path from 'path';
import Joi from 'joi';

dotenv.config({ path: path.join(__dirname, '../../../.env') });

function getValidationObject() {

    const JoiValidationContent: any = {
        NODE_ENV: Joi.string().valid('production', 'development', 'test', 'dev').required(),
        PORT: Joi.number().default(3001),
        SERVER: Joi.string().default('http://localhost:3000'),
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
    server: envVars.SERVER,
};
