import { Global, Module } from '@nestjs/common';
import { DescriptionInput } from './description.input';
import { EmailInput } from './email.input';
import { NameInput } from './name.input';
import { PasswordInput } from './password.input';
import { TextInput } from './text.input';
import { TitleInput } from './title.input';
import { LabelInput } from './label.input';

export const inputModules = {
  DescriptionInput,
  EmailInput,
  NameInput,
  PasswordInput,
  TextInput,
  TitleInput,
  LabelInput,
};

const inputModulesArray = Object.values(inputModules);

@Global()
@Module({
  providers: inputModulesArray,
  exports: inputModulesArray,
})
export class InputsModule {}
