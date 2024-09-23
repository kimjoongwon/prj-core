import { StringField } from '../../decorators/field.decorators';

export class TokenPayloadDto {
  @StringField()
  userId: string;
}
