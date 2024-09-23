import { Logger, MiddlewareConsumer, Module, OnModuleInit } from '@nestjs/common';
import { LoggerMiddleware } from '@shared';
import { adminModules, libModules } from '../main.config';
import { JwtStrategy } from '../shared/domains/auth/strategies/jwt.strategy';
import { RouterModule } from '@nestjs/core';
import { AdminAuthModule } from './admin/auth/admin-auth.module';

@Module({
  imports: [
    ...libModules,
    ...adminModules,
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
