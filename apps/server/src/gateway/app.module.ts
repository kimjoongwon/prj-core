import { Logger, MiddlewareConsumer, Module, OnModuleInit } from '@nestjs/common';
import { InitModule, JwtStrategy, LoggerMiddleware, UsersRepository, UsersService } from '@shared';
import { libModules } from '../main.config';
import { RouterModule } from '@nestjs/core';
import { CaslModule } from 'nest-casl';
import { CategoriesEndpointModule } from './admin/tenancies/tenancyId/services/serviceId/categories/categories-endpoint.module';
import { ClassificationsEndpointModule } from './admin/tenancies/tenancyId/services/serviceId/categories/categoryId/classifications/classifications-endpoint.module';
import { AssociationsEndpointModule } from './admin/tenancies/tenancyId/services/serviceId/groups/groupId/associations/associations-endpoint.module';
import { BuilderEndpointModule } from './builder/builder-endpoint.module';
import { SpacesEndpointModule } from './admin/spaces/spaces-endpoint.module';
import { GroupsEndpointModule } from './admin/tenancies/tenancyId/services/serviceId/groups/groups-endpoint.module';
import { UsersEndpointModule } from './admin/tenancies/tenancyId/services/serviceId/groups/groupId/users/users-endpoint.module';
import { AuthEndpointModule } from './auth/auth-endpoint.module';
@Module({
  imports: [
    ...libModules,
    CaslModule,
    InitModule,
    AssociationsEndpointModule,
    SpacesEndpointModule,
    BuilderEndpointModule,
    CategoriesEndpointModule,
    UsersEndpointModule,
    AuthEndpointModule,
    RouterModule.register([
      {
        path: 'api',
        children: [
          {
            path: 'v1',
            children: [
              {
                path: 'builder',
                module: BuilderEndpointModule,
              },
              {
                path: 'admin',
                children: [
                  {
                    path: 'auth',
                    module: AuthEndpointModule,
                  },
                  {
                    path: 'tenancies',
                    children: [
                      {
                        path: ':tenancyId',
                        children: [
                          {
                            path: 'services',
                            children: [
                              {
                                path: ':serviceId',
                                children: [
                                  {
                                    path: 'categories',
                                    module: CategoriesEndpointModule,
                                    children: [
                                      {
                                        path: ':categoryId',
                                        children: [
                                          {
                                            path: 'classifications',
                                            module: ClassificationsEndpointModule,
                                          },
                                        ],
                                      },
                                    ],
                                  },
                                  {
                                    path: 'groups',
                                    module: GroupsEndpointModule,
                                    children: [
                                      {
                                        path: ':groupId',
                                        children: [
                                          {
                                            path: 'associations',
                                            module: AssociationsEndpointModule,
                                          },
                                          {
                                            path: 'users',
                                            module: UsersEndpointModule,
                                          },
                                        ],
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ]),
  ],
  providers: [JwtStrategy, UsersService, UsersRepository],
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
