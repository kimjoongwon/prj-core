import { Module } from '@nestjs/common';
import { BuilderService } from '@shared';
import { BuilderEndpoint } from './builder.endpoint';
import { BuilderModule } from '../../shared/domains/builder/builder.module';

@Module({
  imports: [BuilderModule],
  controllers: [BuilderEndpoint],
})
export class BuilderEndpointModule {}
