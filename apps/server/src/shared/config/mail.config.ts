// import { registerAs } from '@nestjs/config';
// import { MailConfig } from './config.type';
// import { z } from 'nestjs-zod/z';

// const environmentVariablesValidatorSchema = z.object({
//   MAIL_PORT: z.string().transform(Number).optional(),
//   MAIL_HOST: z.string(),
//   MAIL_USER: z.string().optional(),
//   MAIL_PASSWORD: z.string().optional(),
//   MAIL_DEFAULT_EMAIL: z.string().email(),
//   MAIL_DEFAULT_NAME: z.string(),
//   MAIL_IGNORE_TLS: z.string().transform(Boolean),
//   MAIL_SECURE: z.string().transform(Boolean),
//   MAIL_REQUIRE_TLS: z.string().transform(Boolean),
// });

// export default registerAs<MailConfig>('mail', () => {
//   const result = environmentVariablesValidatorSchema.parse(process.env);

//   return {
//     port: result.MAIL_PORT || 587,
//     host: result.MAIL_HOST,
//     user: result.MAIL_USER,
//     password: result.MAIL_PASSWORD,
//     defaultEmail: result.MAIL_DEFAULT_EMAIL,
//     defaultName: result.MAIL_DEFAULT_NAME,
//     ignoreTLS: result.MAIL_IGNORE_TLS,
//     secure: result.MAIL_SECURE,
//     requireTLS: result.MAIL_REQUIRE_TLS,
//   };
// });
