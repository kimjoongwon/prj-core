import {
  HttpStatus,
  Logger,
  MiddlewareConsumer,
  Module,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  APP_FILTER,
  APP_GUARD,
  HttpAdapterHost,
  RouterModule,
} from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
import pino from 'pino';
import {
  PrismaClientExceptionFilter,
  PrismaModule,
  QueryInfo,
  loggingMiddleware,
} from 'nestjs-prisma';
import {
  CaslModule,
  CategoriesModule,
  LoggerMiddleware,
  ServicesModule,
  appConfig,
  authConfig,
  corsConfig,
  databaseConfig,
  fileConfig,
  mailConfig,
} from '@shared/backend';
import { JwtAuthGuard } from './auth/guards/jwt.auth-guard';
import { AuthModule } from './auth/auth.module';
import { AuthzModule } from './authz/authz.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    CaslModule,
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
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    RouterModule.register([
      {
        path: 'api/v1',
        children: [
          {
            path: 'admin',
            module: AdminModule,
            children: [
              {
                path: 'services',
                module: ServicesModule,
                children: [
                  {
                    path: ':serviceName/categories',
                    module: CategoriesModule,
                  },
                ],
              },
            ],
          },
          {
            path: 'auth',
            module: AuthModule,
          },
          {
            path: 'authz',
            module: AuthzModule,
          },
        ],
      },
    ]),
    CategoriesModule,
    ServicesModule,
    AdminModule,
    AuthModule,
    AuthzModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_FILTER,
      useFactory: ({ httpAdapter }: HttpAdapterHost) =>
        new PrismaClientExceptionFilter(httpAdapter, {
          P2000: HttpStatus.BAD_REQUEST,
          P2002: HttpStatus.CONFLICT,
          P2025: HttpStatus.NOT_FOUND,
        }),
      inject: [HttpAdapterHost],
    },
  ],
})
export class AppModule implements OnModuleInit {
  constructor() {}
  onModuleInit() {}
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
