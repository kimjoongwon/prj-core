import { StringField } from "../../../decorators/field.decorators";

export class RemoveManySpaceDto {
  @StringField({ isArray: true, each: true })
  spaceIds: string[];
}
