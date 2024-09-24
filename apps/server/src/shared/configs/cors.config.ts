import { registerAs } from '@nestjs/config';
import { CorsConfig } from './config.type';
import validateConfig from '../utils/validate-config';
import { IsBoolean } from 'class-validator';

class EnvironmentVariablesValidator {
  @IsBoolean()
  CORS_ENABLED: boolean;
}

export default registerAs<CorsConfig>('cors', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    enabled: process.env.CORS_ENABLED === 'true' ? true : false,
  };
});
