import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import {
  AuthModule,
  PrismaModule,
  ProfilesModule,
  UsersModule,
  WorkspacesModule,
  LoggerModule,
} from './modules';

import { GqlConfigService } from './common';
import {
  databaseConfig,
  authConfig,
  appConfig,
  mailConfig,
  fileConfig,
} from './configs';
import corsConfig from './configs/cors.config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/AllExceptionsFilter';
import { LoggingInterceptor } from './common/interceptors';
import { RolesModule } from './modules/roles/roles.module';

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
    WorkspacesModule,
    ProfilesModule,
    HttpModule,
    AuthModule,
    RolesModule,
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
