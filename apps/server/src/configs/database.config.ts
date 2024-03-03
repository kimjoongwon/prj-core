import { registerAs } from '@nestjs/config';
import { DatabaseConfig } from './config.type';
import { z } from 'zod';
import { InternalServerErrorException } from '@nestjs/common';

const environmentVariablesValidatorSchema = z.object({
  DATABASE_URL: z.string().optional(),
  DATABASE_TYPE: z.string(),
  DATABASE_HOST: z.string(),
  DATABASE_PORT: z.number().int().min(0).max(65535).optional(),
  DATABASE_PASSWORD: z.string().optional(),
  DATABASE_NAME: z.string(),
  DATABASE_USERNAME: z.string(),
  DATABASE_SYNCHRONIZE: z.boolean().optional(),
  DATABASE_MAX_CONNECTIONS: z.number().int().optional(),
  DATABASE_SSL_ENABLED: z.boolean().optional(),
  DATABASE_REJECT_UNAUTHORIZED: z.boolean().optional(),
  DATABASE_CA: z.string().optional(),
  DATABASE_KEY: z.string().optional(),
  DATABASE_CERT: z.string().optional(),
});

export default registerAs<DatabaseConfig>('database', () => {
  const result = environmentVariablesValidatorSchema.safeParse(process.env);

  if (!result.success) {
    throw new Error('Environment variables validation error');
  }

  return {
    url: process.env.DATABASE_URL,
    type: process.env.DATABASE_TYPE,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT
      ? parseInt(process.env.DATABASE_PORT, 10)
      : 5432,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USERNAME,
    synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
    maxConnections: process.env.DATABASE_MAX_CONNECTIONS
      ? parseInt(process.env.DATABASE_MAX_CONNECTIONS, 10)
      : 100,
    sslEnabled: process.env.DATABASE_SSL_ENABLED === 'true',
    rejectUnauthorized: process.env.DATABASE_REJECT_UNAUTHORIZED === 'true',
    ca: process.env.DATABASE_CA,
    key: process.env.DATABASE_KEY,
    cert: process.env.DATABASE_CERT,
  };
});
