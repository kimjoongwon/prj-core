import { Base } from '../../../common/interfaces/base.interface';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Session as CoCSession } from '@prisma/client';
import { Timeline } from '../../timelines/models/timeline.model';

@ObjectType()
@InputType('SessionInputType')
export class Session extends Base implements CoCSession {
  @Field(type => [Date])
  dates: Date[];

  @Field(type => String)
  tenantId: string;

  @Field(type => String)
  name: string;

  @Field(type => [Timeline], { nullable: true })
  tilelines?: Timeline[];
}
