import { Global, Module } from '@nestjs/common';
import { CategoryForm } from './category.form';
import { ContentFormSection } from './content-form.section';
import { LoginForm } from './login.form';

@Global()
@Module({
  providers: [CategoryForm, ContentFormSection, LoginForm],
  exports: [CategoryForm, ContentFormSection, LoginForm],
})
export class FormsModule {}
