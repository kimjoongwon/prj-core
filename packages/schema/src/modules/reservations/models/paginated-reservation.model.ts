import { Paginated } from '../../../common/models/paginated.model';
import { ObjectType } from '@nestjs/graphql';
import { Reservation } from './reservation.model';

@ObjectType()
export class PaginatedReservation extends Paginated(Reservation) {}
