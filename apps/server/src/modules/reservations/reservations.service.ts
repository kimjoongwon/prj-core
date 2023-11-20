import { Injectable } from '@nestjs/common';
import { last } from 'lodash';
import { PrismaService } from '../global/prisma/prisma.service';
import { queryBuilder } from '../../common/utils/query-builder';
import { CreateReservationInput } from './dto/create-reservation.input';
import { GetReservationsArgs } from './dto/get-reservations.args';
import { UpdateReservationInput } from './dto/update-reservation.input';
import { ReservationForm } from './models/reservation-form.model';
import { PaginatedReservation } from './models/paginated-reservation.model';

@Injectable()
export class ReservationsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createReservationInput: CreateReservationInput) {
    return this.prisma.reservation.create({
      data: createReservationInput,
    });
  }

  findForm(): ReservationForm {
    return {
      status: 'PENDING',
      timelineItemId: '1',
    };
  }

  async findPaginatedReservation(
    args: GetReservationsArgs,
  ): Promise<PaginatedReservation> {
    const query = queryBuilder(args, []);

    const reservations = await this.prisma.reservation.findMany({
      ...query,
    });

    const totalCount = await this.prisma.reservation.count({
      where: query?.where,
    });

    const endCursor = last(reservations)?.id;

    return {
      edges: reservations.map(reservation => ({ node: reservation })),
      nodes: reservations,
      pageInfo: {
        totalCount,
        endCursor,
        hasNextPage: !(reservations.length < args.take),
      },
    };
  }

  delete(id: string) {
    return this.prisma.reservation.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  findOne(id: string) {
    return this.prisma.reservation.findUnique({
      where: { id },
    });
  }

  update(updateCategoryInput: UpdateReservationInput) {
    return this.prisma.reservation.update({
      where: { id: updateCategoryInput.id },
      data: updateCategoryInput,
    });
  }
}
