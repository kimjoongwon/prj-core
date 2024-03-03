import { registerAs } from '@nestjs/config';
import { AuthConfig } from './config.type';
import validateConfig from '../common/utils/validate-config';
import { IsString } from 'class-validator';

class EnvironmentVariablesValidator {
  @IsString()
  AUTH_JWT_SECRET: string;
  @IsString()
  AUTH_JWT_TOKEN_EXPIRES_IN: string;
  @IsString()
  AUTH_JWT_TOKEN_REFRESH_IN: string;
}

export default registerAs<AuthConfig>('auth', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    secret: process.env.AUTH_JWT_SECRET,
    refresh: process.env.AUTH_JWT_TOKEN_REFRESH_IN,
    expires: process.env.AUTH_JWT_TOKEN_EXPIRES_IN,
    bcryptSaltOrRound: 10,
  };
});
