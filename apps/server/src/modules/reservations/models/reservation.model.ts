import { Base } from '../../../common/interfaces/base.interface';
import { Field, ObjectType } from '@nestjs/graphql';
import { Reservation as CoCReservation } from '@coc/database';

@ObjectType()
export class Reservation extends Base implements CoCReservation {
  @Field(type => String)
  status: string;

  @Field(type => String)
  timelineItemId: string;
}
