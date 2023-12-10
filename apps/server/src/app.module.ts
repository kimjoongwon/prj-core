import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppService } from './app.service';
import { LoggingInterceptor } from './common/interceptors';
import { appModules, libModules } from './settings';
import { PrismaService } from './modules/global/prisma/prisma.service';

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
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}

  async onApplicationBootstrap() {
    const prisma = this.prisma;
    async function getModelNames() {
      const modelNames = Object.keys(prisma).filter(
        modelName => !(modelName.includes('$') || modelName.includes('_')),
      );
      return modelNames;
    }

    console.log(getModelNames());

    await this.appService.setInitialDB();
  }
}
