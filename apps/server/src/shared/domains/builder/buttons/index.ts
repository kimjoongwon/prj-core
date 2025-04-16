import { Global, Module } from '@nestjs/common';
import { CellButtonService } from './cell-button.service';

@Global()
@Module({
  providers: [CellButtonService],
  exports: [CellButtonService],
})
export class CellButtonsModule {}
