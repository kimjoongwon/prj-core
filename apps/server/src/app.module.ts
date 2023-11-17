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
import { SpacesModule } from './modules/spaces/spaces.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default';
import { join } from 'path';
import { upperDirectiveTransformer } from './directive-transforms/upper-directive-transformer';
import GraphQLJSON from 'graphql-type-json';
import {
  DirectiveLocation,
  GraphQLDirective,
  GraphQLScalarType,
  GraphQLString,
} from 'graphql';
import {
  EmailAddressMock,
  EmailAddressResolver,
  EmailAddressTypeDefinition,
} from 'graphql-scalars';
import { EmailAddress } from 'node_modules/graphql-scalars/typings/typeDefs.cjs';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      fieldResolverEnhancers: ['interceptors', 'filters', 'guards'],
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: false,
      // resolvers: [{ EmailAddress: EmailAddressResolver }],
      plugins: [
        process.env.NODE_ENV === 'production'
          ? ApolloServerPluginLandingPageProductionDefault()
          : ApolloServerPluginLandingPageLocalDefault(),
      ],
      transformSchema: schema => {
        return upperDirectiveTransformer(schema, 'upper');
      },
      introspection: true,
      buildSchemaOptions: {
        directives: [
          new GraphQLDirective({
            name: 'upper',
            locations: [DirectiveLocation.FIELD_DEFINITION],
          }),
        ],
      },
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
    GroupsModule,
    SpacesModule,
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
