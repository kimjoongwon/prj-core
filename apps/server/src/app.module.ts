import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppService } from './app.service';
import { LoggingInterceptor } from './common/interceptors';
import { appModules, libModules } from './settings';

@Module({
  imports: [...libModules, ...appModules],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly appService: AppService) {}
  async onApplicationBootstrap() {
    await this.appService.setInitialDB();
  }
}
