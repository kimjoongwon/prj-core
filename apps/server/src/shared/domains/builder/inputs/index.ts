import { Global, Module } from '@nestjs/common';
import { DepotInput } from './depot.input';
import { DescriptionInput } from './description.input';
import { EmailInput } from './email.input';
import { NameInput } from './name.input';
import { PasswordInput } from './password.input';
import { TextInput } from './text.input';
import { TitleInput } from './title.input';

@Global()
@Module({
  providers: [
    DepotInput,
    DescriptionInput,
    EmailInput,
    NameInput,
    PasswordInput,
    TextInput,
    TitleInput,
  ],
  exports: [
    DepotInput,
    DescriptionInput,
    EmailInput,
    NameInput,
    PasswordInput,
    TextInput,
    TitleInput,
  ],
})
export class InputsModule {}
