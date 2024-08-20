import { HttpStatus, Logger, MiddlewareConsumer, Module, OnModuleInit } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, HttpAdapterHost } from '@nestjs/core';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import { JwtAuthGuard, LoggerMiddleware } from '@shared';
import { adminModules, libModules } from '../main.config';
import { JwtStrategy } from './auth/strategies/jwt.strategy';

@Module({
  imports: [...libModules, ...adminModules],
  providers: [
    JwtStrategy,
    {
      provide: APP_GUARD,
      useValue: JwtAuthGuard,
    },
    {
      provide: APP_FILTER,
      useFactory: ({ httpAdapter }: HttpAdapterHost) =>
        new PrismaClientExceptionFilter(httpAdapter, {
          P2000: HttpStatus.BAD_REQUEST,
          P2002: HttpStatus.CONFLICT,
          P2025: HttpStatus.NOT_FOUND,
        }),
      inject: [HttpAdapterHost],
    },
  ],
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
