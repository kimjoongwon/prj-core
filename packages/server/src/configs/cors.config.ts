import { registerAs } from '@nestjs/config';
import { CorsConfig } from './config.type';
import { z } from 'nestjs-zod/z';

const environmentVariablesValidatorSchema = z.object({
  CORS_ENABLED: z.string().transform(Boolean),
});

export default registerAs<CorsConfig>('cors', () => {
  const result = environmentVariablesValidatorSchema.parse(process.env);

  return {
    enabled: result.CORS_ENABLED,
  };
});
