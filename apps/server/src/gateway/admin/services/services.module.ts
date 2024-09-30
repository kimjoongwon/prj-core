import { Module } from '@nestjs/common';
import { ServicesModule } from '@shared';
import { ServicesController } from './services.controller';

@Module({
  imports: [ServicesModule],
  controllers: [ServicesController],
})
export class AdminServicesModule {}
