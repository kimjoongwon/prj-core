import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { GymsRepository } from '../repositories/Gyms.repository';
import { CreateGymDto, GymQueryDto } from '../dtos';

@Injectable()
export class GymsService {
  constructor(private readonly repository: GymsRepository) {}

  getById(id: string) {
    return this.repository.findUnique({
      where: { id },
    });
  }

  removeManyByIds(GymIds: string[]) {
    return this.repository.updateMany({
      where: {
        id: {
          in: GymIds,
        },
      },
      data: { removedAt: new Date() },
    });
  }

  deleteById(id: string) {
    return this.repository.delete({
      where: { id },
    });
  }

  create(createGymDto: CreateGymDto) {
    return this.repository.create({
      data: createGymDto,
    });
  }

  async getManyByQuery(query: GymQueryDto) {
    const args = query.toArgs();
    const countArgs = query.toCountArgs();
    const gyms = await this.repository.findMany(args);
    const count = await this.repository.count(countArgs);
    return {
      gyms,
      count,
    };
  }

  remove(id: string) {
    return this.repository.update({
      where: { id },
      data: { removedAt: new Date() },
    });
  }
}
