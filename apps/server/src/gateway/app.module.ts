import { Logger, MiddlewareConsumer, Module, OnModuleInit } from '@nestjs/common';
import {
  FormsModule,
  InitModule,
  InputsModule,
  JwtStrategy,
  LoggerMiddleware,
  PagesModule,
  GlobalModule,
  ColumnsModule,
  CellButtonsModule,
  TablesModule,
} from '@shared';
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
import { AbilitiesEndpointModule } from './abilities/abilities-endpoint.module';
import { SubjectsEndpointModule } from './subjects/subjects-endpoint.module';
import { TimelinesEndpointModule } from './timelines/timelines-endpoint.module';
import { SessionsEndpointModule } from './sessions/sessions-endpoint.module';
import { RoutinesEndpointModule } from './routines/routines-endpoint.module';
import { ProgramsEndpointModule } from './programs/programs-endpoint.module';
import { AdminAuthRouteEndpointModule } from './app/admin-auth-endpoint.module';
import { AdminMainRouteEndpointModule } from './app/admin-main-endpoint.module';
import { DepotsEndpointModule } from './depots/depots-endpoint.module';
import { ExercisesEndpointModule } from './exercise/exercises-endpoint.module';
import { FilesEndpointModule } from './files/files-endpoint.module';
import { TenantsEndpointModule } from './tenants/tenants-endpoint.module';
import { GroundsEndpointModule } from './grounds/ground-endpoint.module';

@Module({
  imports: [
    ...libModules,
    GlobalModule,
    GroundsEndpointModule,
    ColumnsModule,
    InputsModule,
    FormsModule,
    PagesModule,
    CellButtonsModule,
    TablesModule,
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
    AbilitiesEndpointModule,
    SubjectsEndpointModule,
    TimelinesEndpointModule,
    SessionsEndpointModule,
    ProgramsEndpointModule,
    RoutinesEndpointModule,
    DepotsEndpointModule,
    ExercisesEndpointModule,
    FilesEndpointModule,
    TenantsEndpointModule,
    AdminAuthRouteEndpointModule,
    AdminMainRouteEndpointModule,
    RouterModule.register([
      {
        path: 'api',
        children: [
          {
            path: 'v1',
            children: [
              {
                path: 'admin/auth',
                module: AdminAuthRouteEndpointModule,
              },
              {
                path: 'admin/main',
                module: AdminMainRouteEndpointModule,
              },
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
              {
                path: 'abilities',
                module: AbilitiesEndpointModule,
              },
              {
                path: 'subjects',
                module: SubjectsEndpointModule,
              },
              {
                path: 'sessions',
                module: SessionsEndpointModule,
              },
              {
                path: 'timelines',
                module: TimelinesEndpointModule,
              },
              {
                path: 'programs',
                module: ProgramsEndpointModule,
              },
              {
                path: 'routines',
                module: RoutinesEndpointModule,
              },
              {
                path: 'depots',
                module: DepotsEndpointModule,
              },
              {
                path: 'exercises',
                module: ExercisesEndpointModule,
              },
              {
                path: 'file',
                module: FilesEndpointModule,
              },
              {
                path: 'grounds',
                module: GroundsEndpointModule,
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
