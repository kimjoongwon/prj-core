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
  PrismaService,
  QueryInfo,
  loggingMiddleware,
} from 'nestjs-prisma';
import {
  CaslModule,
  CategoriesModule,
  LoggerMiddleware,
  RolesModule,
  RolesService,
  ServicesModule,
  ServicesService,
  SpacesModule,
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
import { AdminService } from './admin/admin.service';

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
    ServicesModule,
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
                path: 'categories',
                module: CategoriesModule,
              },
              {
                path: 'services',
                module: ServicesModule,
              },
              {
                path: 'spaces',
                module: SpacesModule,
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
    AdminModule,
    AuthModule,
    AuthzModule,
    RolesModule,
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
  logger = new Logger(AppModule.name);

  constructor(
    private readonly adminService: AdminService,
    private readonly prisma: PrismaService,
    private readonly rolesService: RolesService,
    private readonly servicesService: ServicesService,
  ) {}

  async onModuleInit() {
    this.adminService.createSuperAdmin();

    const superAdminRole = await this.prisma.role.findFirst({
      where: {
        name: 'SUPER_ADMIN',
      },
    });

    const userRole = await this.prisma.role.findFirst({
      where: {
        name: 'USER',
      },
    });

    if (!superAdminRole) {
      this.logger.log('Create SUPER_ADMIN Role');
      await this.rolesService.createSuperAdmin();
    }

    if (!userRole) {
      this.logger.log('Create USER Role');
      await this.rolesService.createUser();
    }

    const baseSpace = await this.prisma.space.findUnique({
      where: {
        name: '기본',
      },
    });

    this.logger.log(baseSpace, 'BaseSpace Exist');

    if (!baseSpace) {
      await this.prisma.space.create({
        data: {
          name: '기본',
        },
      });
    }

    this.logger.log(baseSpace, 'BaseSpace Exist1');
    try {
      const result = this.servicesService.createServices();
      this.logger.log(baseSpace, 'BaseSpace Exist2', result);
    } catch (error) {
      this.logger.error(error);
    }
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
