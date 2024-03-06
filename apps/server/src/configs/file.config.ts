import { registerAs } from '@nestjs/config';
import { FileConfig } from './config.type';
import { z } from 'nestjs-zod/z';

enum FileDriver {
  LOCAL = 'local',
  S3 = 's3',
}

const environmentVariablesValidatorSchema = z.object({
  FILE_DRIVER: z.nativeEnum(FileDriver),
  ACCESS_KEY_ID: z.string().optional(),
  SECRET_ACCESS_KEY: z.string().optional(),
  AWS_DEFAULT_S3_BUCKET: z.string().optional(),
  AWS_DEFAULT_S3_URL: z.string().optional(),
  AWS_S3_REGION: z.string().optional(),
});

export default registerAs<FileConfig>('file', () => {
  const result = environmentVariablesValidatorSchema.safeParse(process.env);

  if (!result.success) {
    throw new Error('File Environment variables validation error');
  }

  return {
    driver: process.env.FILE_DRIVER ?? 'local',
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    awsDefaultS3Bucket: process.env.AWS_DEFAULT_S3_BUCKET,
    awsDefaultS3Url: process.env.AWS_DEFAULT_S3_URL,
    awsS3Region: process.env.AWS_S3_REGION,
    maxFileSize: 5242880, // 5mb
  };
});
