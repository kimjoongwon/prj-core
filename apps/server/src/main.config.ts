import { ClsModule } from 'nestjs-cls';
import { CaslModule } from './casl/casl.module';
import { AbilitiesModule } from './domains/admin/abilities/abilities.module';
import { CategoriesModule } from './domains/admin/categories/categories.module';
import { GroupsModule } from './domains/admin/groups/groups.module';
import { ServicesModule } from './domains/admin/services/services.module';
import { SpacesModule } from './domains/admin/spaces/spaces.module';
import { SubjectsModule } from './domains/admin/subjects/subjects.module';
import { AuthModule } from './domains/auth/auth.module';
import { Logger } from '@nestjs/common';
import { appConfig, authConfig, corsConfig, databaseConfig, fileConfig, mailConfig } from '@shared';
import { loggingMiddleware, PrismaModule, QueryInfo } from 'nestjs-prisma';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule } from '@nestjs/config';
import pino from 'pino';

export const domainModules = [
  CategoriesModule,
  ServicesModule,
  SpacesModule,
  GroupsModule,
  AbilitiesModule,
  SubjectsModule,
  CaslModule,
  AuthModule,
];

export const libModules = [
  ClsModule.forRoot({
    global: true,
    middleware: {
      mount: true,
    },
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
