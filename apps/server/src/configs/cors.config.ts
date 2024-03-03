import { registerAs } from '@nestjs/config';
import { CorsConfig } from './config.type';
import { z } from 'zod';
import { InternalServerErrorException } from '@nestjs/common';

const environmentVariablesValidatorSchema = z.object({
  CORS_ENABLED: z.boolean(),
});

export default registerAs<CorsConfig>('cors', () => {
  const result = environmentVariablesValidatorSchema.safeParse(process.env);

  if (!result.success) {
    throw new InternalServerErrorException(
      'Environment variables validation error',
    );
  }

  return {
    enabled: process.env.CORS_ENABLED === 'true',
  };
});
