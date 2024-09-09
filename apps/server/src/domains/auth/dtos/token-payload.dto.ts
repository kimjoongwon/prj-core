import { NumberField, StringField } from '@shared';

export class TokenPayloadDto {
  @NumberField()
  expiresIn: number;
  @StringField()
  accessToken: string;
}
