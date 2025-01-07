import { Module } from '@nestjs/common';
import { BuilderService } from '@shared';
import { BuilderEndpoint } from './builder.endpoint';

@Module({
  controllers: [BuilderEndpoint],
  providers: [BuilderService],
})
export class BuilderEndpointModule {}
