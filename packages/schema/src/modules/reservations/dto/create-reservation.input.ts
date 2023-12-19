import { InputType, OmitType } from '@nestjs/graphql';
import { BASE_FIELDS } from '../../../common/constants';
import { Reservation } from '../models/reservation.model';

@InputType()
export class CreateReservationInput extends OmitType(
  Reservation,
  [...BASE_FIELDS],
  InputType,
) {}
