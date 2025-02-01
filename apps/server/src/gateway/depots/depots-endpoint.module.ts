import { Module } from '@nestjs/common';
import { DepotsController } from '@shared';

@Module({
  controllers: [DepotsController],
})
export class DepotsEndpointModule {}
