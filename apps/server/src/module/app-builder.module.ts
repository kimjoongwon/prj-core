import { Module } from '@nestjs/common';
import { AuthModule } from './auth.module';
import { AppBuilderController, AppBuilderService } from '@shared';

@Module({
  imports: [AuthModule],
  providers: [AppBuilderService],
  controllers: [AppBuilderController],
})
export class AppBuilderModule {}
