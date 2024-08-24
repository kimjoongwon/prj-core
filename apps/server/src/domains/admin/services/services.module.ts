import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { ServiceModule } from '@shared';
import { ServicesController } from './services.controller';

@Module({
  imports: [ServiceModule],
  controllers: [ServicesController],
})
export class ServicesModule implements OnModuleInit {
  logger: Logger = new Logger(ServicesModule.name);
  LOG_PREFIX = `${ServicesModule.name} DB_INIT`;
  async onModuleInit() {
    this.logger.log(`[${this.LOG_PREFIX}] Create Services`);
  }
}
