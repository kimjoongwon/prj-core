import { NumberField, StringField } from '@shared/backend';

export class TokenPayloadDto {
  @NumberField()
  expiresIn: number;
  @StringField()
  accessToken: string;
}
