import { Module } from '@nestjs/common';
import { BuilderEndpoint } from './builder.endpoint';
import { BuilderService } from '@shared';

@Module({
  providers: [BuilderService],
  controllers: [BuilderEndpoint],
})
export class BuilderModule {}
