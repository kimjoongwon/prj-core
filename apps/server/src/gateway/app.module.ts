import { Logger, MiddlewareConsumer, Module, OnModuleInit } from '@nestjs/common';
import { InitModule, JwtStrategy, LoggerMiddleware, UsersRepository, UsersService } from '@shared';
import { libModules } from '../main.config';
import { RouterModule } from '@nestjs/core';
import { CaslModule } from 'nest-casl';
import { CategoriesEndpointModule } from './categories/categories-endpoint.module';
import { ClassificationsEndpointModule } from './classifications/classifications-endpoint.module';
import { AssociationsEndpointModule } from './associations/associations-endpoint.module';
import { BuilderEndpointModule } from './builder/builder-endpoint.module';
import { GroupsEndpointModule } from './groups/groups-endpoint.module';
import { UsersEndpointModule } from './users/users-endpoint.module';
import { AuthEndpointModule } from './auth/auth-endpoint.module';
import { SpacesEndpointModule } from './spaces/spaces-endpoint.module';
import { RolesEndpointModule } from './roles/roles-endpoint.module';
import { ActionsEndpointModule } from './actions/actions-endpoint.module';

@Module({
  imports: [
    ...libModules,
    CaslModule,
    InitModule,
    ClassificationsEndpointModule,
    AssociationsEndpointModule,
    BuilderEndpointModule,
    CategoriesEndpointModule,
    GroupsEndpointModule,
    SpacesEndpointModule,
    UsersEndpointModule,
    AuthEndpointModule,
    RolesEndpointModule,
    ActionsEndpointModule,
    RouterModule.register([
      {
        path: 'api',
        children: [
          {
            path: 'v1',
            children: [
              {
                path: 'associations',
                module: AssociationsEndpointModule,
              },
              {
                path: 'auth',
                module: AuthEndpointModule,
              },
              {
                path: 'builder',
                module: BuilderEndpointModule,
              },
              {
                path: 'categories',
                module: CategoriesEndpointModule,
              },
              {
                path: 'classifications',
                module: ClassificationsEndpointModule,
              },
              {
                path: 'groups',
                module: GroupsEndpointModule,
              },
              {
                path: 'spaces',
                module: SpacesEndpointModule,
              },
              {
                path: 'users',
                module: UsersEndpointModule,
              },
              {
                path: 'roles',
                module: RolesEndpointModule,
              },
              {
                path: 'actions',
                module: ActionsEndpointModule,
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
