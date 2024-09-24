import { Logger, MiddlewareConsumer, Module, OnModuleInit } from '@nestjs/common';
import { InitModule, LoggerMiddleware } from '@shared';
import { adminModules, libModules } from '../main.config';
import { JwtStrategy } from '../shared/domains/auth/strategies/jwt.strategy';
import { RouterModule } from '@nestjs/core';
import { AdminAuthModule } from './admin/auth/admin-auth.module';
import { ServiceAuthModule } from './service/auth/service-auth.module';

@Module({
  imports: [
    InitModule,
    ...libModules,
    ...adminModules,
    ServiceAuthModule,
    RouterModule.register([
      {
        path: 'admin',
        children: [
          {
            path: 'auth',
            module: AdminAuthModule,
          },
        ],
      },
      {
        path: 'service',
        children: [
          {
            path: 'auth',
            module: ServiceAuthModule,
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
