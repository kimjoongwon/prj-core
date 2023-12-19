import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { plugins } from './plugins';
import { upperDirectiveTransformer } from '../directive-transforms/upper-directive-transformer';
import { ConfigModule } from '@nestjs/config';
import {
  appConfig,
  authConfig,
  corsConfig,
  databaseConfig,
  fileConfig,
  mailConfig,
} from '../configs';
import { HttpModule } from '@nestjs/axios';
import { EmailAddressResolver } from 'graphql-scalars';

export const libModules = [
  GraphQLModule.forRoot<ApolloDriverConfig>({
    driver: ApolloDriver,
    fieldResolverEnhancers: ['interceptors', 'filters', 'guards'],
    autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    sortSchema: true,
    playground: false,
    plugins,
    transformSchema: schema => upperDirectiveTransformer(schema, 'upper'),
    resolvers: {
      EmailAddress: EmailAddressResolver,
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
  HttpModule,
];
