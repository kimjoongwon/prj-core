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
  AdminSessionsModule,
  AdminSpacesModule,
  AdminSubjectsModule,
  AdminTemplatesModule,
  AdminTimelineItemsModule,
  AssociationsEndpointModule,
  UsersEndpointModule,
} from './admin';
import { AdminAppBuilderModule } from './admin/builder/admin-builder.module';
import { CaslModule } from 'nest-casl';
import { AdminAbilityModule } from './admin/abilities/admin-abilities.module';
import { ServicesModule } from '../shared/entities/services';
import { P } from 'ts-pattern';

@Module({
  imports: [
    ...libModules,
    InitModule,
    UsersEndpointModule,
    AssociationsEndpointModule,
    AdminCategoriesModule,
    AdminAbilityModule,
    AdminTemplatesModule,
    AdminTimelineItemsModule,
    AdminSpacesModule,
    AdminGroupsModule,
    AdminSubjectsModule,
    CaslModule,
    AuthAdminModule,
    ServiceAuthModule,
    ServicesModule,
    AdminSessionsModule,
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
                    module: ServicesModule,
                    children: [
                      {
                        path: ':service-name/groups',
                        module: AdminGroupsModule,
                      },
                    ],
                  },
                  {
                    path: 'app-builder',
                    module: AdminAppBuilderModule,
                  },
                  {
                    path: 'templates',
                    module: AdminTemplatesModule,
                  },
                  {
                    path: 'categories',
                    module: AdminCategoriesModule,
                  },
                  {
                    path: 'users',
                    module: UsersEndpointModule,
                  },
                  // {
                  //   path: 'groups',
                  //   module: AdminGroupsModule,
                  //   children: [
                  //     {
                  //       path: ':groupId/associations',
                  //       module: AssociationsEndpointModule,
                  //     },
                  //   ],
                  // },
                  {
                    path: 'classifications',
                    module: AdminClassificationsModule,
                  },
                  {
                    path: 'spaces',
                    module: AdminSpacesModule,
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
