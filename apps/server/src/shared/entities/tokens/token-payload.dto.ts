import { StringField } from 'src/shared/decorators/field.decorators';

export class TokenPayloadDto {
  @StringField()
  userId: string;
}
