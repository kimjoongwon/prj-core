import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Injectable } from '@nestjs/common';
import { GqlOptionsFactory } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { DirectiveLocation, GraphQLDirective } from 'graphql';
import { upperDirectiveTransformer } from '../../directive-transforms/upper-directive-transformer';
import {
  BigIntResolver,
  EmailAddressResolver,
  EmailAddressTypeDefinition,
  LocaleDefinition,
  LocaleResolver,
  resolvers as scalarResolvers,
} from 'graphql-scalars';
import { typeDefs as scalarTypeDefs } from 'graphql-scalars';
import { LocaleMock } from 'graphql-scalars';

@Injectable()
export class GqlConfigService implements GqlOptionsFactory {
  createGqlOptions(): ApolloDriverConfig {
    return {
      driver: ApolloDriver,
      fieldResolverEnhancers: ['interceptors', 'filters', 'guards'],
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: false,
      plugins: [
        ApolloServerPluginLandingPageLocalDefault(),
        // ApolloServerPluginLandingPageProductionDefault(),
      ],
      definitions: {
        path: join(process.cwd(), 'src/graphql/graphql-types.ts'),
        customScalarTypeMapping: {
          EmailAddressTypeDefinition,
        },
      },
      typeDefs: [EmailAddressTypeDefinition],
      transformSchema: schema => {
        return upperDirectiveTransformer(schema, 'upper');
      },
      resolvers: {
        EmailAddress: EmailAddressResolver,
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
    };
  }
}
