import { registerAs } from '@nestjs/config';
import { AppConfig } from './config.type';
import { z } from 'nestjs-zod/z';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

const environmentVariablesValidatorSchema = z.object({
  ADMIN_EMAIL: z.string().email().optional(),
  NODE_ENV: z
    .enum([Environment.Development, Environment.Production, Environment.Test])
    .optional(),
  APP_NAME: z.string(),
  APP_ADMIN_EMAIL: z.string().email(),
  APP_PORT: z.string().transform(Number),
  FRONTEND_DOMAIN: z.string().url(),
  BACKEND_DOMAIN: z.string().url(),
  API_PREFIX: z.string(),
  APP_FALLBACK_LANGUAGE: z.string(),
  APP_HEADER_LANGUAGE: z.string(),
});

export default registerAs<AppConfig>('app', () => {
  // const parsedEnv = environmentVariablesValidatorSchema.parse(process.env);

  const result = environmentVariablesValidatorSchema.parse(process.env);
  console.log(result);
  return {
    adminEmail: result.APP_ADMIN_EMAIL,
    nodeEnv: result.NODE_ENV || 'development',
    name: result.APP_NAME || 'app',
    workingDirectory: process.cwd(),
    frontendDomain: result.FRONTEND_DOMAIN,
    backendDomain: result.BACKEND_DOMAIN ?? 'http://localhost',
    port: result.APP_PORT || 3006,
    apiPrefix: result.API_PREFIX || 'api',
    fallbackLanguage: result.APP_FALLBACK_LANGUAGE || 'en',
    headerLanguage: result.APP_HEADER_LANGUAGE || 'x-custom-lang',
  };
});
