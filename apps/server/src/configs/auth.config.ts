import { registerAs } from '@nestjs/config';
import { AuthConfig } from './config.type';
import { IsString } from 'class-validator';
import validateConfig from '../utils/validate-config';

class EnvironmentVariablesValidator {
  AUTH_JWT_SECRET: string;
  AUTH_JWT_TOKEN_EXPIRES_IN: string;
  AUTH_JWT_TOKEN_REFRESH_IN: string;
}

export default registerAs<AuthConfig>('auth', () => {
  console.log(process.env);
  // validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    secret: process.env.AUTH_JWT_SECRET,
    expires: process.env.AUTH_JWT_TOKEN_EXPIRES_IN,
    refresh: process.env.AUTH_JWT_TOKEN_REFRESH_IN,
    bcryptSaltOrRound: 10,
  };
});
