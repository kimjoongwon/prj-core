import { registerAs } from '@nestjs/config';
import { IsBoolean } from 'class-validator';
import { CorsConfig } from './config.type';
import validateConfig from '../common/utils/validate-config';

class EnvironmentVariablesValidator {
  @IsBoolean()
  CORS_ENABLED: boolean;
}

export default registerAs<CorsConfig>('cors', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    enabled: process.env.CORS_ENABLED === 'true',
  };
});
