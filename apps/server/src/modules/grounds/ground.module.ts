import { Module } from '@nestjs/common';
import { GroundsController, GroundsRepository, GroundsService } from '../../shared';

@Module({
  providers: [GroundsService, GroundsRepository],
  controllers: [GroundsController],
})
export class GroundsModule {}
