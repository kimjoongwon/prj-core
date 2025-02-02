import { Global, Module } from '@nestjs/common';
import { NewEditButton } from './new-edit.button';

@Global()
@Module({
  providers: [NewEditButton],
  exports: [NewEditButton],
})
export class ButtonsModule {}
