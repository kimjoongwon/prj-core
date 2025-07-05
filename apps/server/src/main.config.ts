import { ClsModule } from 'nestjs-cls';
// import { CaslModule } from '@shared/backend';
import { Logger } from '@nestjs/common';
import { appConfig, authConfig, awsConfig, corsConfig, smtpConfig, AuthConfig } from '@shared/backend';
import { loggingMiddleware, PrismaModule, QueryInfo } from 'nestjs-prisma';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { logConfig } from '@shared/backend';
import pino from 'pino';

export const adminModules = [];

export const libModules = [
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
  // CaslModule,
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
      return {
        secret: authConfig?.secret,
        signOptions: { expiresIn: authConfig?.expires },
      };
    },
    inject: [ConfigService],
  }),
  PrismaModule.forRoot({
    isGlobal: true,
    prismaServiceOptions: {
      middlewares: [
        loggingMiddleware({
          logger: new Logger('🗄️ Prisma'),
          logLevel: process.env.NODE_ENV === 'production' ? 'warn' : 'log',
          logMessage: (query: QueryInfo) => {
            const isProduction = process.env.NODE_ENV === 'production';
            const emoji = query.executionTime > 500 ? '🐌' : '⚡';

            if (isProduction && query.executionTime <= 1000) {
              return null; // 빠른 쿼리는 로깅하지 않음
            }

            return isProduction
              ? `${emoji} Slow query: ${query.model}.${query.action} (${query.executionTime}ms)`
              : `${emoji} ${query.model}.${query.action} (${query.executionTime}ms)`;
          },
        }),
        async (params, next) => {
          const result = await next(params);
          return result;
        },
      ],
    },
  }),
  LoggerModule.forRoot({
    pinoHttp: {
      level: logConfig.prettyPrint ? 'debug' : 'info',
      customProps: () => ({
        context: 'HTTP',
      }),
      stream: pino.destination({
        dest: './logs',
        minLength: 4096,
        sync: false,
      }),
      transport: logConfig.prettyPrint
        ? {
            target: 'pino-pretty',
            options: {
              colorize: logConfig.colorize,
              translateTime: 'yyyy-mm-dd HH:MM:ss',
              ignore:
                'pid,hostname,req.remoteAddress,req.remotePort,res.headers,req.headers.host,req.headers.connection',
              singleLine: false,
              hideObject: false,
              messageFormat: logConfig.context ? '🚀 [{context}] {msg}' : '🚀 {msg}',
              levelFirst: true,
              customColors: 'info:blue,warn:yellow,error:red',
              useOnlyCustomProps: false,
            },
          }
        : undefined,
      formatters: {
        level: (label) => ({ level: label }),
        log: (object) => {
          // 불필요한 필드 제거
          const { req, res, ...rest } = object;
          return rest;
        },
      },
      redact: {
        paths: [
          'req.headers.authorization',
          'req.headers.cookie',
          'req.headers["user-agent"]',
          'req.headers.referer',
          'req.headers.origin',
          'req.body.password',
          'req.body.token',
        ],
        remove: true,
      },
      serializers: {
        req: (req) => ({
          method: req.method,
          url: req.url,
          id: req.id,
        }),
        res: (res) => ({
          statusCode: res.statusCode,
        }),
      },
    },
  }),
  ConfigModule.forRoot({
    isGlobal: true,
    load: [authConfig, appConfig, corsConfig, smtpConfig, awsConfig],
    envFilePath: '.env',
  }),
];
