import { registerAs } from '@nestjs/config';
import { AuthConfig } from './config.type';
import { z } from 'zod';
import { InternalServerErrorException } from '@nestjs/common';

const environmentVariablesValidatorSchema = z.object({
  AUTH_JWT_SECRET: z.string(),
  AUTH_JWT_TOKEN_EXPIRES_IN: z.string(),
  AUTH_JWT_TOKEN_REFRESH_IN: z.string(),
});

export default registerAs<AuthConfig>('auth', () => {
  const result = environmentVariablesValidatorSchema.safeParse(process.env);

  if (!result.success) {
    throw new InternalServerErrorException(
      'Environment variables validation error',
    );
  }

  return {
    secret: process.env.AUTH_JWT_SECRET,
    refresh: process.env.AUTH_JWT_TOKEN_REFRESH_IN,
    expires: process.env.AUTH_JWT_TOKEN_EXPIRES_IN,
    bcryptSaltOrRound: 10,
  };
});
