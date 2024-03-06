import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_PIPE, HttpAdapterHost } from '@nestjs/core';
import {
  appConfig,
  authConfig,
  corsConfig,
  databaseConfig,
  fileConfig,
  mailConfig,
} from './configs';
import { LoggerModule } from 'nestjs-pino';
import pino from 'pino';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { ZodValidationPipe } from 'nestjs-zod';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt.auth-guard';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { RolesModule } from './modules/roles/roles.module';
import { SpacesModule } from './modules/spaces/spaces.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { UsersModule } from './modules/users/users.module';
import {
  PrismaModule,
  QueryInfo,
  loggingMiddleware,
  providePrismaClientExceptionFilter,
} from 'nestjs-prisma';

@Module({
  imports: [
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [
          loggingMiddleware({
            logger: new Logger('PrismaMiddleware'),
            logLevel: 'log', // default is `debug`
            logMessage: (query: QueryInfo) =>
              `[Prisma Query] ${query.model}.${query.action} - ${query.executionTime}ms`,
          }),
          async (params, next) => {
            // Before query: change params
            const result = await next(params);
            // After query: result
            return result;
          },
        ], // see example loggingMiddleware below
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
      load: [
        databaseConfig,
        authConfig,
        appConfig,
        mailConfig,
        fileConfig,
        corsConfig,
      ],
      envFilePath: '.env',
    }),
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    UsersModule,
    ProfilesModule,
    SpacesModule,
    TenantsModule,
    RolesModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    providePrismaClientExceptionFilter(),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
