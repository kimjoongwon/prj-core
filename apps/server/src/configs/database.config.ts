import { registerAs } from '@nestjs/config';
import { DatabaseConfig } from './config.type';
import { z } from 'nestjs-zod/z';

const environmentVariablesValidatorSchema = z.object({
  DATABASE_URL: z.string().optional(),
  DATABASE_TYPE: z.string(),
  DATABASE_HOST: z.string(),
  DATABASE_PORT: z.string().optional().default('5432').transform(Number),
  DATABASE_PASSWORD: z.string().optional(),
  DATABASE_NAME: z.string(),
  DATABASE_USERNAME: z.string(),
  DATABASE_SYNCHRONIZE: z.string().optional().transform(Boolean),
  DATABASE_MAX_CONNECTIONS: z.string().transform(Number).optional(),
  DATABASE_SSL_ENABLED: z.string().transform(Boolean).optional(),
  DATABASE_REJECT_UNAUTHORIZED: z.string().transform(Boolean).optional(),
  DATABASE_CA: z.string().optional(),
  DATABASE_KEY: z.string().optional(),
  DATABASE_CERT: z.string().optional(),
});

export default registerAs<DatabaseConfig>('database', () => {
  const result = environmentVariablesValidatorSchema.parse(process.env);

  return {
    url: result.DATABASE_URL,
    type: result.DATABASE_TYPE,
    host: result.DATABASE_HOST,
    port: result.DATABASE_PORT,
    password: result.DATABASE_PASSWORD,
    name: result.DATABASE_NAME,
    username: result.DATABASE_USERNAME,
    synchronize: result.DATABASE_SYNCHRONIZE,
    maxConnections: result.DATABASE_MAX_CONNECTIONS || 100,
    sslEnabled: result.DATABASE_SSL_ENABLED,
    rejectUnauthorized: result.DATABASE_REJECT_UNAUTHORIZED,
    ca: result.DATABASE_CA,
    key: result.DATABASE_KEY,
    cert: result.DATABASE_CERT,
  };
});
