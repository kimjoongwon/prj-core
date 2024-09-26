import { Logger, MiddlewareConsumer, Module, OnModuleInit } from '@nestjs/common';
import { InitModule, LoggerMiddleware } from '@shared';
import { adminModules, libModules } from '../main.config';
import { JwtStrategy } from '../shared/domains/auth/strategies/jwt.strategy';
import { RouterModule } from '@nestjs/core';
import { AuthAdminModule } from './auth/admin/auth-admin.module';
import { ServiceAuthModule } from './auth/service/auth/service-auth.module';
import { AuthModule } from './auth/auth.module';
import { AdminTemplatesModule } from './admin';

@Module({
  imports: [
    InitModule,
    ...libModules,
    ...adminModules,
    RouterModule.register([
      {
        path: 'api',
        children: [
          {
            path: 'v1',
            children: [
              {
                path: 'admin',
                module: AdminTemplatesModule,
              },
              {
                path: 'auth',
                module: AuthModule,
                children: [
                  {
                    path: 'admin',
                    module: AuthAdminModule,
                  },
                  {
                    path: 'service',
                    module: ServiceAuthModule,
                  },
                ],
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
