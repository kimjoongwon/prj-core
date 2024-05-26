import { PageOptionsDto, StringField } from '@shared';

export class GroupPageOptionsDto extends PageOptionsDto {
  @StringField({ nullable: true })
  name?: string;
}
