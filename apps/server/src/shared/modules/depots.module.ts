import { Module } from '@nestjs/common';
import { DepotsService } from '../services/depots.service';
import { DepotsRepository } from '../repositories/depots.repository';
import { AwsService } from '../domains/aws/aws.service';

@Module({
  providers: [DepotsService, DepotsRepository, AwsService],
  exports: [DepotsService],
})
export class DepotsModule {}
