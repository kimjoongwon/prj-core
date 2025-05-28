import { Module } from '@nestjs/common';
import { AppBuilderController } from './app-builder.controller';
import { AppBuilderService } from './app-builder.service';

@Module({
  providers: [AppBuilderService],
  controllers: [AppBuilderController],
})
export class AppBuilderModule {}
