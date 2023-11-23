import { Base } from '../../../common/interfaces/base.interface';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Timeline as CoCTimeline } from '@prisma/client';

@ObjectType()
@InputType('TimelineInputType')
export class Timeline extends Base implements CoCTimeline {
  @Field(type => String)
  sessionId: string;

  @Field(type => String)
  tenantId: string;
}
