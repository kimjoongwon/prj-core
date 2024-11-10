import { AbstractEntity } from '../common';
import { Page as PageEntity, Prisma } from '@prisma/client';
export class Page extends AbstractEntity implements PageEntity {
  name: string;
  pathname: string;
  params: Prisma.JsonValue;
}
