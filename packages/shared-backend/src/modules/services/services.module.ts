import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { PrismaService } from 'nestjs-prisma';

@Module({
  controllers: [ServicesController],
  providers: [ServicesService, PrismaService],
})
export class ServicesModule implements OnModuleInit {
  logger = new Logger(ServicesModule.name);
  constructor(private readonly servicesService: ServicesService) {}
  async onModuleInit() {
    this.logger.debug('service creating...');
    await this.servicesService.createServices();
    this.logger.debug('service complete');
  }
}
