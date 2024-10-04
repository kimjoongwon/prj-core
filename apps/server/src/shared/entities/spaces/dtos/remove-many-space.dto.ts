import { StringField } from '../../../decorators/field.decorators';

export class RemoveManySpaceDto {
  @StringField({ each: true })
  spaceIds: string[];
}
