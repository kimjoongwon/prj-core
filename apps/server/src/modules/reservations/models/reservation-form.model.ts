import { ObjectType, IntersectionType } from '@nestjs/graphql';
import { CreateReservationInput } from '../dto/create-reservation.input';

@ObjectType()
class AdditionalForm {}

@ObjectType()
export class ReservationForm extends IntersectionType(
  CreateReservationInput,
  AdditionalForm,
  ObjectType,
) {}

export const defaultReservationForm: ReservationForm = {
  status: '',
  timelineItemId: '',
};
