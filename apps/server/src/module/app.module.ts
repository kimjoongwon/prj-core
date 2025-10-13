// NestJS core imports
import {
  Logger,
  MiddlewareConsumer,
  Module,
  OnModuleInit,
} from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
// Shared imports
import {
  ContextService,
  LoggerMiddleware,
  RequestContextInterceptor,
} from "@shared";
// Third-party imports
import { CaslModule } from "nest-casl";
// Global modules
import { globalModules } from "../global.module";
import { ResponseEntityInterceptor } from "../shared/interceptor/response-entity.interceptor";
import { AuthModule } from "./auth.module";
import { CategoriesModule } from "./categories.module";
import { ExercisesModule } from "./exercises.module";
import { FileClassificationsModule } from "./file-classifications.module";
import { FilesModule } from "./files.module";
import { GroundsModule } from "./grounds.module";
import { GroupsModule } from "./groups.module";
import { PrismaModule } from "./prisma.module";
import { ProgramsModule } from "./programs.module";
import { RoleClassificationsModule } from "./role-classifications.module";
import { RolesModule } from "./roles.module";
import { RoutinesModule } from "./routines.module";
import { SessionsModule } from "./sessions.module";
import { SpaceClassificationsModule } from "./space-classifications.module";
import { SpacesModule } from "./spaces.module";
import { SubjectsModule } from "./subjects.module";
import { TenantsModule } from "./tenants.module";
import { TimelinesModule } from "./timelines.module";
import { UserClassificationsModule } from "./user-classifications.module";
import { UsersModule } from "./users.module";

@Module({
  imports: [
    ...globalModules,
    PrismaModule,
    CaslModule,
    GroundsModule,
    UserClassificationsModule,
    RoleClassificationsModule,
    FileClassificationsModule,
    SpaceClassificationsModule,
    CategoriesModule,
    GroupsModule,
    SpacesModule,
    UsersModule,
    AuthModule,
    RolesModule,
    SubjectsModule,
    TimelinesModule,
    SessionsModule,
    ProgramsModule,
    RoutinesModule,
    ExercisesModule,
    FilesModule,
    TenantsModule,
    RouterModule.register([
      {
        path: "api",
        children: [
          {
            path: "v1",
            children: [
              {
                path: "tenants",
                module: TenantsModule,
              },
              {
                path: "auth",
                module: AuthModule,
              },
              {
                path: "categories",
                module: CategoriesModule,
              },
              {
                path: "groups",
                module: GroupsModule,
              },
              {
                path: "spaces",
                module: SpacesModule,
                children: [
                  {
                    path: "classifications",
                    module: SpaceClassificationsModule,
                  },
                ],
              },
              {
                path: "users",
                module: UsersModule,
                children: [
                  {
                    path: "classifications",
                    module: UserClassificationsModule,
                  },
                ],
              },
              {
                path: "roles",
                module: RolesModule,
                children: [
                  {
                    path: "classifications",
                    module: RoleClassificationsModule,
                  },
                ],
              },
              {
                path: "subjects",
                module: SubjectsModule,
              },
              {
                path: "sessions",
                module: SessionsModule,
              },
              {
                path: "timelines",
                module: TimelinesModule,
              },
              {
                path: "programs",
                module: ProgramsModule,
              },
              {
                path: "routines",
                module: RoutinesModule,
              },
              {
                path: "exercises",
                module: ExercisesModule,
              },
              {
                path: "files",
                module: FilesModule,
                children: [
                  {
                    path: "classifications",
                    module: FileClassificationsModule,
                  },
                ],
              },
              {
                path: "grounds",
                module: GroundsModule,
              },
            ],
          },
        ],
      },
    ]),
  ],
  providers: [
    RequestContextInterceptor,
    ResponseEntityInterceptor,
    ContextService,
  ],
})
export class AppModule implements OnModuleInit {
  logger = new Logger(AppModule.name);
  LOG_PREFIX = `${AppModule.name} INIT`;

  async onModuleInit() {
    this.logger.log(`[${this.LOG_PREFIX}] APP_MODULE INITIALIZED`);
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
