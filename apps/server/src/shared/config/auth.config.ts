import { registerAs } from '@nestjs/config';
import { ValidationUtil } from '@shared/utils';
import { IsString } from 'class-validator';
import { AuthConfig } from './config.type';

class EnvironmentVariablesValidator {
  @IsString()
  AUTH_JWT_SECRET!: string;

  @IsString()
  AUTH_JWT_TOKEN_EXPIRES_IN!: string;

  @IsString()
  AUTH_JWT_TOKEN_REFRESH_IN!: string;

  @IsString()
  AUTH_JWT_SALT_ROUNDS!: string;
}

export default registerAs<AuthConfig>('auth', () => {
  ValidationUtil.validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    secret: process.env.AUTH_JWT_SECRET,
    refresh: process.env.AUTH_JWT_TOKEN_REFRESH_IN,
    expires: process.env.AUTH_JWT_TOKEN_EXPIRES_IN,
    bcryptSaltOrRound: Number(process.env.AUTH_JWT_SALT_ROUNDS),
  };
});
