import { Logger, MiddlewareConsumer, Module, OnModuleInit } from '@nestjs/common';
import {
  FormsModule,
  InitModule,
  InputsModule,
  JwtStrategy,
  LoggerMiddleware,
  PagesModule,
} from '@shared';
import { libModules } from '../main.config';
import { RouterModule } from '@nestjs/core';
import { CaslModule } from 'nest-casl';
import { CategoriesModule } from './categories/categories.module';
import { ClassificationsModule } from './classifications/classifications.module';
import { AssociationsModule } from './associations/associations.module';
import { BuilderModule } from './builder/builder.module';
import { GroupsModule } from './groups/groups.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SpacesModule } from './spaces/spaces.module';
import { RolesModule } from './roles/roles.module';
import { ActionsModule } from './actions/actions.module';
import { AbilitiesModule } from './abilities/abilities.module';
import { SubjectsModule } from './subjects/subjects.module';
import { TimelinesModule } from './timelines/timelines.module';
import { SessionsModule } from './sessions/sessions.module';
import { RoutinesModule } from './routines/routines.module';
import { ProgramsModule } from './programs/programs.module';
import { DepotsModule } from './depots/depots.module';
import { ExercisesModule } from './exercise/exercises.module';
import { FilesModule } from './files/files.module';
import { TenantsModule } from './tenants/tenants.module';
import { GroundsModule } from './grounds/ground.module';
import { GlobalModule } from '@shared';

@Module({
  imports: [
    ...libModules,
    GlobalModule,
    GroundsModule,
    InputsModule,
    FormsModule,
    PagesModule,
    CaslModule,
    InitModule,
    ClassificationsModule,
    AssociationsModule,
    BuilderModule,
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
    RouterModule.register([
      {
        path: 'api',
        children: [
          {
            path: 'v1',
            children: [
              {
                path: 'associations',
                module: AssociationsModule,
              },
              {
                path: 'auth',
                module: AuthModule,
              },
              {
                path: 'builder',
                module: BuilderModule,
              },
              {
                path: 'categories',
                module: CategoriesModule,
              },
              {
                path: 'classifications',
                module: ClassificationsModule,
              },
              {
                path: 'groups',
                module: GroupsModule,
              },
              {
                path: 'spaces',
                module: SpacesModule,
              },
              {
                path: 'users',
                module: UsersModule,
              },
              {
                path: 'roles',
                module: RolesModule,
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
