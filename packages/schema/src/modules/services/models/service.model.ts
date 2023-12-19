import { Field, ObjectType } from '@nestjs/graphql';
import { Service as CoCServer } from '@prisma/client';
import { Base } from '../../../common/interfaces';

@ObjectType()
export class Service extends Base implements CoCServer {
  @Field(type => String)
  name: string;
}
