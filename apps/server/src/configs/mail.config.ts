import { registerAs } from '@nestjs/config';
import { MailConfig } from './config.type';
import { z } from 'zod';

const environmentVariablesValidatorSchema = z.object({
  MAIL_PORT: z.number().int().min(0).max(65535).optional(),
  MAIL_HOST: z.string(),
  MAIL_USER: z.string().optional(),
  MAIL_PASSWORD: z.string().optional(),
  MAIL_DEFAULT_EMAIL: z.string().email(),
  MAIL_DEFAULT_NAME: z.string(),
  MAIL_IGNORE_TLS: z.boolean(),
  MAIL_SECURE: z.boolean(),
  MAIL_REQUIRE_TLS: z.boolean(),
});

export default registerAs<MailConfig>('mail', () => {
  const result = environmentVariablesValidatorSchema.safeParse(process.env);

  if (!result.success) {
    throw new Error('Environment variables validation error');
  }

  return {
    port: process.env.MAIL_PORT ? parseInt(process.env.MAIL_PORT, 10) : 587,
    host: process.env.MAIL_HOST,
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
    defaultEmail: process.env.MAIL_DEFAULT_EMAIL,
    defaultName: process.env.MAIL_DEFAULT_NAME,
    ignoreTLS: process.env.MAIL_IGNORE_TLS === 'true',
    secure: process.env.MAIL_SECURE === 'true',
    requireTLS: process.env.MAIL_REQUIRE_TLS === 'true',
  };
});
