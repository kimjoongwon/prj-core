import { Module } from '@nestjs/common';
import { BuilderService } from '@shared';
import { AdminBuilderController } from './admin-builder.controller';

@Module({
  controllers: [AdminBuilderController],
  providers: [BuilderService],
})
export class AdminAppBuilderModule {}
