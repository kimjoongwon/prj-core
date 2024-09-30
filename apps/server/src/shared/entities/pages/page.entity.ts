import { AbstractEntity } from '../common';
import { $Enums, Page as PageEntity, Prisma } from '@prisma/client';
export class Page extends AbstractEntity implements PageEntity {
  type: $Enums.PageTypes;
  name: string;
  pathname: string;
  params: Prisma.JsonValue;
}
