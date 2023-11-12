import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { GqlConfigService, LoggingInterceptor } from './common';
import {
  databaseConfig,
  authConfig,
  appConfig,
  mailConfig,
  fileConfig,
} from './configs';
import corsConfig from './configs/cors.config';
// import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/AllExceptionsFilter';
import { RolesModule } from './modules/roles/roles.module';
import { AuthModule } from './modules/auth/auth.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { CategoryItemsModule } from './modules/category-items/category-items.module';
import { PrismaModule } from './modules/global/prisma/prisma.module';
import { GroupsModule } from './modules/groups/groups.module';
import { LoggerModule } from './modules/logger/logger.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { ServicesModule } from './modules/services/services.module';
import { UsersModule } from './modules/users/users.module';
import { WorkspacesModule } from './modules/workspaces/workspaces.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useClass: GqlConfigService,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        databaseConfig,
        authConfig,
        appConfig,
        mailConfig,
        fileConfig,
        corsConfig,
      ],
    }),
    LoggerModule,
    PrismaModule,
    UsersModule,
    ProfilesModule,
    HttpModule,
    AuthModule,
    RolesModule,
    CategoriesModule,
    CategoryItemsModule,
    ServicesModule,
    RolesModule,
    WorkspacesModule,
    GroupsModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
