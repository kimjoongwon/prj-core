import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { GqlAuthGuard } from '../../common/guards/gql-auth.guard';
import { Public } from '../../common/decorators/public.decorator';
import { GetReservationsArgs } from './dto/get-reservations.args';
import { CreateReservationInput } from './dto/create-reservation.input';
import { UpdateReservationInput } from './dto/update-reservation.input';
import { PaginatedReservation } from './models/paginated-reservation.model';
import { ReservationForm } from './models/reservation-form.model';
import { Reservation } from './models/reservation.model';

@Resolver(() => Reservation)
@UseGuards(GqlAuthGuard)
export class ReservationsResolver {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Public()
  @Mutation(() => Reservation)
  createReservation(
    @Args('createReservationInput')
    createReservationInput: CreateReservationInput,
  ) {
    return this.reservationsService.create(createReservationInput);
  }

  @Public()
  @Mutation(() => Reservation)
  updateReservation(
    @Args('updateReservationInput')
    updateReservationInput: UpdateReservationInput,
  ) {
    return this.reservationsService.update(updateReservationInput);
  }

  @Public()
  @Mutation(() => Reservation)
  deleteReservation(@Args('id') id: string) {
    return this.reservationsService.delete(id);
  }

  @Public()
  @Query(() => Reservation, { name: 'reservation' })
  getReservation(@Args('id') id: string) {
    return this.reservationsService.findOne(id);
  }

  @Public()
  @Query(() => ReservationForm, { name: 'reservationForm' })
  getReservationForm() {
    return this.reservationsService.findForm();
  }

  @Public()
  @Query(() => PaginatedReservation, { name: 'reservations' })
  getReservations(@Args() args: GetReservationsArgs) {
    return this.reservationsService.findPaginatedReservation(args);
  }
}
