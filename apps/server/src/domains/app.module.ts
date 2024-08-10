import { HttpStatus, Logger, MiddlewareConsumer, Module, OnModuleInit } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, HttpAdapterHost, RouterModule } from '@nestjs/core';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import { JwtAuthGuard, LoggerMiddleware } from '@shared';
import { AuthModule } from './auth/auth.module';
import { ServicesModule } from './admin/services/services.module';
import { SpacesModule } from './admin/spaces/spaces.module';
import { CategoriesModule } from './admin/categories/categories.module';
import { GroupsModule } from './admin/groups/groups.module';
import { AbilitiesModule } from './admin/abilities/abilities.module';
import { SubjectsModule } from './admin/subjects/subjects.module';
import { domainModules, libModules } from '../main.config';

@Module({
  imports: [
    ...libModules,
    ...domainModules,
    RouterModule.register([
      {
        path: 'api/v1',
        children: [
          {
            path: 'admin',
            children: [
              {
                path: 'abilities',
                module: AbilitiesModule,
              },
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
              {
                path: 'groups',
                module: GroupsModule,
              },
              {
                path: 'subjects',
                module: SubjectsModule,
              },
            ],
          },
          {
            path: 'auth',
            module: AuthModule,
          },
        ],
      },
    ]),
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
  LOG_PREFIX = `${AppModule.name} INIT`;

  async onModuleInit() {
    this.logger.log(`[${this.LOG_PREFIX}] APP_MODULE INITIALIZED`);
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
