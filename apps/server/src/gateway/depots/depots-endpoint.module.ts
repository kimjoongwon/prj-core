import { Module } from '@nestjs/common';
import { DepotsController, DepotsModule } from '@shared';

@Module({
  imports: [DepotsModule],
  controllers: [DepotsController],
})
export class DepotsEndpointModule {}
