import { Logger, MiddlewareConsumer, Module, OnModuleInit } from '@nestjs/common';
import { InitModule, JwtStrategy, LoggerMiddleware } from '@shared';
import { libModules } from '../main.config';
import { RouterModule } from '@nestjs/core';
import {
  AdminAppBuilderModule,
  AdminCategoriesModule,
  AdminClassificationsModule,
  AdminGroupsModule,
  AdminSpacesModule,
  AssociationsEndpointModule,
  UsersEndpointModule,
} from './admin';
import { AuthModule } from './auth/auth.module';
import { CaslModule } from 'nest-casl';
@Module({
  imports: [
    ...libModules,
    CaslModule,
    InitModule,
    UsersEndpointModule,
    AssociationsEndpointModule,
    AdminCategoriesModule,
    AdminSpacesModule,
    AdminGroupsModule,
    AuthModule,
    AdminAppBuilderModule,
    AdminClassificationsModule,
    RouterModule.register([
      {
        path: 'api',
        children: [
          {
            path: 'v1',
            children: [
              {
                path: 'admin',
                children: [
                  {
                    path: 'services',
                    children: [
                      {
                        path: ':serviceId',
                        children: [
                          {
                            path: 'categories',
                            module: AdminCategoriesModule,
                            children: [
                              {
                                path: ':categoryId',
                                children: [
                                  {
                                    path: 'classifications',
                                    module: AdminClassificationsModule,
                                  },
                                ],
                              },
                            ],
                          },
                          {
                            path: 'groups',
                            module: AdminGroupsModule,
                            children: [
                              {
                                path: ':groupId',
                                children: [
                                  {
                                    path: 'associations',
                                    module: AssociationsEndpointModule,
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    path: 'app-builder',
                    module: AdminAppBuilderModule,
                  },
                ],
              },
              {
                path: 'auth',
                module: AuthModule,
              },
            ],
          },
        ],
      },
    ]),
  ],
  providers: [JwtStrategy],
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
