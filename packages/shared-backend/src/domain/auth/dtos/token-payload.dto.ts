import { NumberField, StringField } from '../../../decorator/field.decorators';

export class TokenPayloadDto {
  @NumberField()
  expiresIn: number;
  @StringField()
  accessToken: string;
}
