import { Base } from '../../../common/interfaces/base.interface';
import { Field, ObjectType } from '@nestjs/graphql';
import { Session as CoCSession } from '@prisma/client';
import { Timeline } from '../../timelines/models/timeline.model';

@ObjectType()
export class Session extends Base implements CoCSession {
  @Field(type => String)
  tenantId: string;

  @Field(type => Date)
  startDateTime: Date;

  @Field(type => Date)
  endDateTime: Date;

  @Field(type => String)
  name: string;

  @Field(type => [Timeline], { nullable: true })
  tilelines?: Timeline[];
}
