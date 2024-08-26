import { StringField } from 'src/shared/decorators/field.decorators';

export class RemoveManySpaceDto {
  @StringField({ isArray: true, each: true })
  spaceIds: string[];
}
