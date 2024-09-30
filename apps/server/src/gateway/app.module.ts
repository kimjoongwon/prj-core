import { Logger, MiddlewareConsumer, Module, OnModuleInit } from '@nestjs/common';
import { InitModule, LoggerMiddleware, ServicesModule, UsersModule } from '@shared';
import { adminModules, libModules } from '../main.config';
import { JwtStrategy } from '../shared/domains/auth/strategies/jwt.strategy';
import { RouterModule } from '@nestjs/core';
import { AuthAdminModule } from './auth/admin/auth-admin.module';
import { ServiceAuthModule } from './auth/service/auth/service-auth.module';
import { AuthModule } from './auth/auth.module';
import {
  AdminGroupsModule,
  AdminRolesModule,
  AdminServicesModule,
  AdminSessionsModule,
  AdminSpacesModule,
  AdminSubjectsModule,
  AdminTemplatesModule,
  AdminTimelineItemsModule,
  CategoriesModule,
} from './admin';
import { AdminPagesModule } from './admin/pages/admin-pages.module';
import { CaslModule } from 'nest-casl';
import { AdminAbilityModule } from './admin/abilities/admin-abilities.module';

@Module({
  imports: [
    ...libModules,
    InitModule,
    AdminAbilityModule,
    AdminTemplatesModule,
    AdminTimelineItemsModule,
    CategoriesModule,
    AdminSpacesModule,
    AdminGroupsModule,
    AdminSubjectsModule,
    CaslModule,
    AuthAdminModule,
    ServiceAuthModule,
    AdminSessionsModule,
    UsersModule,
    AdminRolesModule,
    AuthModule,
    AdminPagesModule,
    AdminServicesModule,
    ServicesModule,
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
                    path: 'pages',
                    module: AdminPagesModule,
                  },
                  {
                    path: 'templates',
                    module: AdminTemplatesModule,
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
