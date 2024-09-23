import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { ServiceModule, ServicesService } from '@shared';
import { ServicesController } from './services.controller';
import { $Enums } from '@prisma/client';

@Module({
  imports: [ServiceModule],
  controllers: [ServicesController],
})
export class ServicesModule implements OnModuleInit {
  logger: Logger = new Logger(ServicesModule.name);
  LOG_PREFIX = `${ServicesModule.name} DB_INIT`;

  constructor(private readonly serviceService: ServicesService) {}

  async onModuleInit() {
    const services = [
      { name: $Enums.SERVICE_NAME.USER, label: '회원 관리' },
      { name: $Enums.SERVICE_NAME.RESERVATION, label: '예약 관리' },
      { name: $Enums.SERVICE_NAME.SPACE, label: '매장 관리' },
    ];

    await Promise.all(
      services.map((service) =>
        this.serviceService.upsert({
          name: service.name,
          label: service.label,
        }),
      ),
    );

    this.logger.log(`[${this.LOG_PREFIX}] Create Services`);
  }
}
