import { EmailField, StringField, UUIDField } from '@shared/backend';

export class SignUpPayloadDto {
  @StringField()
  nickname: string;
  @UUIDField()
  spaceId: string;
  @EmailField()
  email: string;
  @StringField()
  name: string;
  @StringField()
  phone: string;
  @StringField()
  password: string;
}
