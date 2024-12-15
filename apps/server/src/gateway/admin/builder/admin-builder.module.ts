import { Module } from '@nestjs/common';
import { BuilderService } from '@shared';
import { AdminBuilderController } from './admin-builder.controller';
import { ServicesModule } from '../../../shared/entities/services';

@Module({
  imports: [ServicesModule],
  controllers: [AdminBuilderController],
  providers: [BuilderService],
})
export class AdminAppBuilderModule {}
