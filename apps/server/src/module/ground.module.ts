import { Module } from '@nestjs/common';
import { GroundsController } from '@shared';

@Module({
  controllers: [GroundsController],
})
export class GroundsModule {}
