import { ClsModule } from 'nestjs-cls';
import { CaslModule } from './shared/casl/casl.module';
import { Logger } from '@nestjs/common';
import { appConfig, AuthConfig, authConfig, corsConfig, UsersModule } from '@shared';
import { loggingMiddleware, PrismaModule, QueryInfo } from 'nestjs-prisma';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule, ConfigService } from '@nestjs/config';
import pino from 'pino';
import {
  CategoriesModule,
  AdminGroupsModule,
  ServicesModule,
  AdminSessionsModule,
  AdminSpacesModule,
  AdminSubjectsModule,
  AdminTimelineItemsModule,
  AdminRolesModule,
  AdminTemplatesModule,
} from './gateway/admin';
import { JwtModule } from '@nestjs/jwt';
import { AdminAbilityModule } from './gateway/admin/abilities/admin-abilities.module';
import { AdminAuthModule } from './gateway/admin/auth/admin-auth.module';
import { MailerModule } from '@nestjs-modules/mailer';

export const adminModules = [
  AdminAbilityModule,
  AdminTemplatesModule,
  AdminTimelineItemsModule,
  CategoriesModule,
  ServicesModule,
  AdminSpacesModule,
  AdminGroupsModule,
  AdminSubjectsModule,
  CaslModule,
  AdminAuthModule,
  AdminSessionsModule,
  UsersModule,
  AdminRolesModule,
];

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
  CaslModule,
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
          logger: new Logger('PrismaMiddleware'),
          logLevel: 'debug',
          logMessage: (query: QueryInfo) =>
            `[Prisma Query] ${query.model}.${query.action} - ${query.executionTime}ms`,
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
      customProps: () => ({
        context: 'HTTP',
      }),
      stream: pino.destination({
        dest: './logs',
        minLength: 4096,
        sync: false,
      }),
      transport: {
        target: 'pino-pretty',
        options: {
          singleLine: true,
        },
      },
    },
  }),
  ConfigModule.forRoot({
    isGlobal: true,
    load: [authConfig, appConfig, corsConfig],
    envFilePath: '.env',
  }),
];
