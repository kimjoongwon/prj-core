import { registerAs } from '@nestjs/config';
import { AppConfig } from './config.type';
import { IsEmail, IsEnum, IsNumber, IsString, IsUrl } from 'class-validator';
import validateConfig from '../utils/validate-config';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariablesValidator {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsString()
  APP_NAME: string;

  @IsEmail()
  APP_ADMIN_EMAIL: string;

  @IsNumber()
  APP_PORT: number;

  @IsString()
  API_PREFIX: string;

  @IsUrl()
  FRONTEND_DOMAIN: string;

  @IsUrl()
  BACKEND_DOMAIN: string;

  @IsString()
  APP_FALLBACK_LANGUAGE: string;

  @IsString()
  APP_HEADER_LANGUAGE: string;
}

export default registerAs<AppConfig>('app', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    name: process.env.APP_NAME || 'app',
    adminEmail: process.env.APP_ADMIN_EMAIL,
    workingDirectory: process.cwd(),
    frontendDomain: process.env.FRONTEND_DOMAIN,
    backendDomain: process.env.BACKEND_DOMAIN ?? 'http://localhost',
    port: Number(process.env.APP_PORT) || 3006,
    apiPrefix: process.env.API_PREFIX || 'api',
    fallbackLanguage: process.env.APP_FALLBACK_LANGUAGE || 'en',
    headerLanguage: process.env.APP_HEADER_LANGUAGE || 'x-custom-lang',
  };
});
