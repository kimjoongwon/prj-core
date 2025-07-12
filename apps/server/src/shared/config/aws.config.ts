import { registerAs } from '@nestjs/config';
import { ValidationUtil } from '@shared/utils';
import { IsString } from 'class-validator';
import { AwsConfig } from './config.type';

class EnvironmentVariablesValidator {
  @IsString()
  AWS_ACCESS_KEY_ID!: string;

  @IsString()
  AWS_SECRET_ACCESS_KEY!: string;

  @IsString()
  AWS_REGION!: string;

  @IsString()
  AWS_S3_BUCKET_NAME!: string;
}

export default registerAs<AwsConfig>('aws', () => {
  ValidationUtil.validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    region: process.env.AWS_REGION!,
    s3BucketName: process.env.AWS_S3_BUCKET_NAME!,
  };
});
