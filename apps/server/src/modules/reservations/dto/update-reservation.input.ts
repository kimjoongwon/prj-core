import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { Reservation } from '../models/reservation.model';

@InputType()
export class UpdateReservationInput extends PartialType(
  Reservation,
  InputType,
) {
  @Field(type => ID!, { nullable: true })
  id: string;
}
