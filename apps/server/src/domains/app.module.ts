import { Logger, MiddlewareConsumer, Module, OnModuleInit } from '@nestjs/common';
import { LoggerMiddleware } from '@shared';
import { adminModules, libModules } from '../main.config';
import { JwtStrategy } from './auth/strategies/jwt.strategy';

@Module({
  imports: [...libModules, ...adminModules],
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
