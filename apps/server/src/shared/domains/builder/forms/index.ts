import { Global, Module } from '@nestjs/common';
import { CategoryForm } from './category.form';
import { ContentForm } from './content.form';
import { LoginForm } from './login.form';

@Global()
@Module({
  providers: [CategoryForm, ContentForm, LoginForm],
  exports: [CategoryForm, ContentForm, LoginForm],
})
export class FormsModule {}
