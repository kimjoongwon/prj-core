import { Base } from '../../../common/interfaces/base.interface';
import { Field, ObjectType } from '@nestjs/graphql';
import { TimelineItem as CoCTimelineItem } from '@prisma/client';

@ObjectType()
export class TimelineItem extends Base implements CoCTimelineItem {
  @Field(type => Date)
  startDateTime: Date;

  @Field(type => Date)
  endDateTime: Date;

  @Field(type => Number)
  maxCapacity: number;

  @Field(type => Number)
  minCapacity: number;

  @Field(type => String)
  title: string;

  @Field(type => String)
  description: string;

  @Field(type => String)
  address: string;

  @Field(type => String)
  timelineId: string;
}
