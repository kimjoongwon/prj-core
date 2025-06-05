// NestJS core imports
import { Logger, MiddlewareConsumer, Module, OnModuleInit } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';

// Third-party imports
import { CaslModule } from 'nest-casl';

// Shared imports
import { JwtStrategy, LoggerMiddleware, GlobalModule } from '@shared';
import { libModules } from '../main.config';

// Feature modules
import { AbilitiesModule } from './abilities/abilities.module';
import { ActionsModule } from './actions/actions.module';
import { AppBuilderModule } from './app-builder/app-builder.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { DepotsModule } from './depots/depots.module';
import { ExercisesModule } from './exercise/exercises.module';
import { FileClassificationsModule } from './file-classifications/file-classifications.module';
import { FilesModule } from './files/files.module';
import { GroundsModule } from './grounds/ground.module';
import { GroupsModule } from './groups/groups.module';
import { PagesModule } from './app-builder/components';
import { ProgramsModule } from './programs/programs.module';
import { RoleClassificationsModule } from './role-classifications/role-classifications.module';
import { RolesModule } from './roles/roles.module';
import { RoutinesModule } from './routines/routines.module';
import { SessionsModule } from './sessions/sessions.module';
import { SpaceClassificationsModule } from './space-classifications/space-classifications.module';
import { SpacesModule } from './spaces/spaces.module';
import { SubjectsModule } from './subjects/subjects.module';
import { TenantsModule } from './tenants/tenants.module';
import { TimelinesModule } from './timelines/timelines.module';
import { UserClassificationsModule } from './user-classifications/user-classifications.module';
import { UsersModule } from './users/users.module';
import { WorkspacesModule } from './workspaces/workspaces.module';

@Module({
  imports: [
    ...libModules,
    PagesModule,
    GlobalModule,
    GroundsModule,
    CaslModule,
    UserClassificationsModule,
    RoleClassificationsModule,
    FileClassificationsModule,
    SpaceClassificationsModule,
    AppBuilderModule,
    CategoriesModule,
    GroupsModule,
    SpacesModule,
    UsersModule,
    AuthModule,
    RolesModule,
    ActionsModule,
    AbilitiesModule,
    SubjectsModule,
    TimelinesModule,
    SessionsModule,
    ProgramsModule,
    RoutinesModule,
    DepotsModule,
    ExercisesModule,
    FilesModule,
    TenantsModule,
    WorkspacesModule,
    RouterModule.register([
      {
        path: 'api',
        children: [
          {
            path: 'v1',
            children: [
              {
                path: 'tenants',
                module: TenantsModule,
              },
              {
                path: 'auth',
                module: AuthModule,
              },
              {
                path: 'appBuilder',
                module: AppBuilderModule,
              },
              {
                path: 'categories',
                module: CategoriesModule,
              },
              {
                path: 'groups',
                module: GroupsModule,
              },
              {
                path: 'spaces',
                module: SpacesModule,
                children: [
                  {
                    path: 'classifications',
                    module: SpaceClassificationsModule,
                  },
                ],
              },
              {
                path: 'users',
                module: UsersModule,
                children: [
                  {
                    path: 'classifications',
                    module: UserClassificationsModule,
                  },
                ],
              },
              {
                path: 'roles',
                module: RolesModule,
                children: [
                  {
                    path: 'classifications',
                    module: RoleClassificationsModule,
                  },
                ],
              },
              {
                path: 'actions',
                module: ActionsModule,
              },
              {
                path: 'abilities',
                module: AbilitiesModule,
              },
              {
                path: 'subjects',
                module: SubjectsModule,
              },
              {
                path: 'sessions',
                module: SessionsModule,
              },
              {
                path: 'timelines',
                module: TimelinesModule,
              },
              {
                path: 'programs',
                module: ProgramsModule,
              },
              {
                path: 'routines',
                module: RoutinesModule,
              },
              {
                path: 'depots',
                module: DepotsModule,
              },
              {
                path: 'exercises',
                module: ExercisesModule,
              },
              {
                path: 'files',
                module: FilesModule,
                children: [
                  {
                    path: 'classifications',
                    module: FileClassificationsModule,
                  },
                ],
              },
              {
                path: 'workspaces',
                module: WorkspacesModule,
              },
              {
                path: 'grounds',
                module: GroundsModule,
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
