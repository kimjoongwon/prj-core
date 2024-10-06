import { $Enums } from '@prisma/client';
import { AbstractDto } from '../../common/dtos/abstract.dto';
import { Page } from '../page.entity';
import { EnumField, StringField } from '../../../decorators';
import { IsString } from 'class-validator';

export class PageDto extends AbstractDto implements Page {
  @EnumField(() => $Enums.PageTypes)
  type: $Enums.PageTypes;

  @StringField()
  name: string;

  @StringField()
  pathname: string;
}
