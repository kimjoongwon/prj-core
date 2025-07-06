import { registerAs } from '@nestjs/config';
import { CorsConfig } from './config.type';
import { IsBoolean } from 'class-validator';
import { ValidationUtil } from '@shared/utils';

class EnvironmentVariablesValidator {
  @IsBoolean()
  CORS_ENABLED!: boolean;
}

export default registerAs<CorsConfig>('cors', () => {
  ValidationUtil.validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    enabled: process.env.CORS_ENABLED === 'true' ? true : false,
  };
});
