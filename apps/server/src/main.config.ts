import { ClsModule } from 'nestjs-cls';
import {
  appConfig,
  AuthConfig,
  authConfig,
  awsConfig,
  corsConfig,
  smtpConfig,
} from './shared';
import { PrismaModule } from 'nestjs-prisma';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { JwtModule } from '@nestjs/jwt';
import { DynamicModule } from '@nestjs/common';

export const modules: (DynamicModule | Promise<DynamicModule>)[] = [
  ConfigModule.forRoot({
    isGlobal: true,
    load: [authConfig, appConfig, corsConfig, smtpConfig, awsConfig],
    envFilePath: '.env',
  }),
  MailerModule.forRootAsync({
    useFactory: async (config: ConfigService) => {
      const smtpConfig = await config.get('smtp');
      return {
        transport: {
          host: smtpConfig.host,
          port: smtpConfig.port,
          secure: true,
          auth: {
            user: smtpConfig.username,
            pass: smtpConfig.password,
          },
        },
        defaults: {
          from: smtpConfig.sender,
        },
      };
    },
    inject: [ConfigService],
  }),
  ClsModule.forRoot({
    global: true,
    middleware: {
      mount: true,
    },
  }),
  JwtModule.registerAsync({
    global: true,
    useFactory: async (config: ConfigService) => {
      const authConfig = await config.get<AuthConfig>('auth');
      if (!authConfig?.secret) {
        throw new Error('JWT secret is not defined in the configuration.');
      }
      if (!authConfig?.expires) {
        throw new Error('JWT expiration time is not defined in the configuration.');
      }
      return {
        global: true,
        // secret: authConfig?.secret || 'default',
        // privateKey: authConfig?.secret,
        signOptions: { expiresIn: authConfig?.expires },
        secretOrPrivateKey: authConfig?.secret,
      };
    },
    inject: [ConfigService],
  }),
  PrismaModule.forRoot({
    isGlobal: true,
  }),
  // LoggerModule.forRoot({
  //   pinoHttp: {
  //     // level: logConfig.prettyPrint ? 'debug' : 'info',
  //     customProps: () => ({
  //       context: 'HTTP',
  //     }),
  //     stream: pino.destination({
  //       dest: './logs',
  //       minLength: 4096,
  //       sync: false,
  //     }),
  //     // transport: logConfig.prettyPrint
  //     //   ? {
  //     //       target: 'pino-pretty',
  //     //       options: {
  //     //         colorize: logConfig.colorize,
  //     //         translateTime: 'yyyy-mm-dd HH:MM:ss',
  //     //         ignore:
  //     //           'pid,hostname,req.remoteAddress,req.remotePort,res.headers,req.headers.host,req.headers.connection',
  //     //         singleLine: false,
  //     //         hideObject: false,
  //     //         messageFormat: logConfig.context ? '🚀 [{context}] {msg}' : '🚀 {msg}',
  //     //         levelFirst: true,
  //     //         customColors: 'info:blue,warn:yellow,error:red',
  //     //         useOnlyCustomProps: false,
  //     //       },
  //     //     }
  //     //   : undefined,
  //     formatters: {
  //       level: (label) => ({ level: label }),
  //       log: (object) => {
  //         // 불필요한 필드 제거
  //         const { req, res, ...rest } = object;
  //         return rest;
  //       },
  //     },
  //     redact: {
  //       paths: [
  //         'req.headers.authorization',
  //         'req.headers.cookie',
  //         'req.headers["user-agent"]',
  //         'req.headers.referer',
  //         'req.headers.origin',
  //         'req.body.password',
  //         'req.body.token',
  //       ],
  //       remove: true,
  //     },
  //     serializers: {
  //       req: (req) => ({
  //         method: req.method,
  //         url: req.url,
  //         id: req.id,
  //       }),
  //       res: (res) => ({
  //         statusCode: res.statusCode,
  //       }),
  //     },
  //   },
  // }),
];
