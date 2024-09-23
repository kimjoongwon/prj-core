import { OmitType } from '@nestjs/swagger';
import { ReservationDto } from './reservation.dto';
import { COMMON_ENTITY_FIELDS } from '../../../constants';

export class CreateReservationDto extends OmitType(ReservationDto, [...COMMON_ENTITY_FIELDS]) {}
