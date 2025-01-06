import { Logger, MiddlewareConsumer, Module, OnModuleInit } from '@nestjs/common';
import { InitModule, LoggerMiddleware, UsersModule } from '@shared';
import { libModules } from '../main.config';
import { JwtStrategy } from '../shared/domains/auth/strategies/jwt.strategy';
import { RouterModule } from '@nestjs/core';
import { AuthAdminModule } from './auth/admin/auth-admin.module';
import { ServiceAuthModule } from './auth/service/auth/service-auth.module';
import { AuthModule } from './auth/auth.module';
import {
  AdminCategoriesModule,
  AdminClassificationsModule,
  AdminGroupsModule,
  AdminRolesModule,
  AdminSpacesModule,
  AssociationsEndpointModule,
  UsersEndpointModule,
} from './admin';
import { AdminAppBuilderModule } from './admin/builder/admin-builder.module';
import { CaslModule } from 'nest-casl';
import { AdminAbilityModule } from './admin/abilities/admin-abilities.module';
import { ServicesModule } from '../shared/entities/services';
@Module({
  imports: [
    ...libModules,
    CaslModule,
    InitModule,
    UsersEndpointModule,
    AssociationsEndpointModule,
    AdminCategoriesModule,
    AdminAbilityModule,
    AdminSpacesModule,
    AdminGroupsModule,
    AuthAdminModule,
    ServiceAuthModule,
    ServicesModule,
    UsersModule,
    AdminRolesModule,
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
                children: [
                  {
                    path: 'admin',
                    module: AuthAdminModule,
                  },
                  {
                    path: 'service',
                    module: ServiceAuthModule,
                  },
                ],
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
