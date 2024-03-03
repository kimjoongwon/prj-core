import { registerAs } from '@nestjs/config';
import { AppConfig } from './config.type';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';
import { z } from 'zod';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

const environmentVariablesValidatorSchema = z.object({
  ADMIN_EMAIL: z.string().email().optional(),
  NODE_ENV: z.nativeEnum(Environment),
  APP_NAME: z.string(),
  APP_ADMIN_EMAIL: z.string().email(),
  APP_PORT: z.number().int().min(0).max(65535),
  FRONTEND_DOMAIN: z.string().url(),
  BACKEND_DOMAIN: z.string().url(),
  API_PREFIX: z.string(),
  APP_FALLBACK_LANGUAGE: z.string(),
  APP_HEADER_LANGUAGE: z.string(),
});

export default registerAs<AppConfig>('app', () => {
  environmentVariablesValidatorSchema.parse(process.env);

  return {
    adminEmail: process.env.APP_ADMIN_EMAIL,
    nodeEnv: process.env.NODE_ENV || 'development',
    name: process.env.APP_NAME || 'app',
    workingDirectory: process.env.PWD || process.cwd(),
    frontendDomain: process.env.FRONTEND_DOMAIN,
    backendDomain: process.env.BACKEND_DOMAIN ?? 'http://localhost',
    port: process.env.APP_PORT
      ? parseInt(process.env.APP_PORT, 10)
      : process.env.PORT
        ? parseInt(process.env.PORT, 10)
        : 3006,
    apiPrefix: process.env.API_PREFIX || 'api',
    fallbackLanguage: process.env.APP_FALLBACK_LANGUAGE || 'en',
    headerLanguage: process.env.APP_HEADER_LANGUAGE || 'x-custom-lang',
  };
});
