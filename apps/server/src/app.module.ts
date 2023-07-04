import { Logger, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { AuthModule, ProfilesModule, UsersModule } from '@modules';
import {
  databaseConfig,
  authConfig,
  appConfig,
  mailConfig,
  fileConfig,
} from '@configs';
import { GqlConfigService } from '@common';
import corsConfig from '@configs/cors.config';
import { PrismaModule, loggingMiddleware } from 'nestjs-prisma';

@Module({
  imports: [
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
      envFilePath: ['.env'],
    }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [
          loggingMiddleware({
            logger: new Logger('PrismaMiddleware'),
            logLevel: 'warn',
          }),
        ],
      },
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useClass: GqlConfigService,
    }),
    HttpModule,
    UsersModule,
    AuthModule,
    ProfilesModule,
  ],
})
export class AppModule {}
