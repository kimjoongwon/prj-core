import { ClsModule } from 'nestjs-cls';
import { CaslModule } from './shared/casl/casl.module';
import { AuthModule } from './domains/auth/auth.module';
import { Logger } from '@nestjs/common';
import {
  appConfig,
  AuthConfig,
  authConfig,
  corsConfig,
  databaseConfig,
  fileConfig,
  mailConfig,
  UserModule,
} from '@shared';
import { loggingMiddleware, PrismaModule, QueryInfo } from 'nestjs-prisma';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule, ConfigService } from '@nestjs/config';
import pino from 'pino';
import {
  CategoriesModule,
  GroupsModule,
  RolesModule,
  ServicesModule,
  SessionsModule,
  SpacesModule,
  SubjectsModule,
  TimelineItemsModule,
} from './domains/admin';
import { JwtModule } from '@nestjs/jwt';
import { TemplatesModule } from './domains/admin/templates/templates.module';
import { AdminAbilityModule } from './domains/admin/abilities/admin-abilities.module';

export const adminModules = [
  AdminAbilityModule,
  TemplatesModule,
  TimelineItemsModule,
  CategoriesModule,
  ServicesModule,
  SpacesModule,
  GroupsModule,
  SubjectsModule,
  CaslModule,
  AuthModule,
  SessionsModule,
  UserModule,
  RolesModule,
];

export const libModules = [
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
    load: [databaseConfig, authConfig, appConfig, mailConfig, fileConfig, corsConfig],
    envFilePath: '.env',
  }),
];
