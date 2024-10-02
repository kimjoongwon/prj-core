import { $Enums } from '@prisma/client';
import { AbstractDto } from '../../common/dtos/abstract.dto';
import { Page } from '../page.entity';
import { EnumField } from '../../../decorators';
import { IsString } from 'class-validator';
import { CreatePageDto } from './create-page.dto';

export const pageDtos: CreatePageDto[] = [];

export class PageDto extends AbstractDto implements Page {
  @EnumField(() => $Enums.PageTypes)
  type: $Enums.PageTypes;

  @IsString()
  name: string;

  @IsString()
  pathname: string;
}
