import { Module } from '@nestjs/common';
import { BuilderController } from './builder.controller';
import { BuilderService } from '@shared';

@Module({
  providers: [BuilderService],
  controllers: [BuilderController],
})
export class BuilderModule {}
