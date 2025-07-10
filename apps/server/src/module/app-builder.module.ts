import { Module } from '@nestjs/common';
import { AppBuilderController, AppBuilderService } from '@shared';
import { AuthModule } from './auth.module';

@Module({
  imports: [AuthModule],
  providers: [AppBuilderService],
  controllers: [AppBuilderController],
})
export class AppBuilderModule {}
