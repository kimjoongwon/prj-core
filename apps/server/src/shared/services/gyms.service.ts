import { Injectable } from '@nestjs/common';
import { GymsRepository } from '../repositories/Gyms.repository';
import { CreateGymDto, GymQueryDto, UpdateGymDto } from '../dtos';
import { Gym } from '../entities';

@Injectable()
export class GymsService {
  constructor(private readonly repository: GymsRepository) {}

  getById(id: string) {
    return this.repository.findUnique({
      where: { id },
    });
  }

  removeManyByIds(gymIds: string[]) {
    return this.repository.updateMany({
      where: {
        id: {
          in: gymIds,
        },
      },
      data: { removedAt: new Date() },
    });
  }

  create({ categoryId, space, ...data }: CreateGymDto) {
    return this.repository.create({
      data: {
        address: data.address,
        phone: data.phone,
        businessNumber: data.businessNumber,
        email: data.email,
        depot: {
          connect: {
            id: data.depotId,
          },
        },
        space: {
          create: {
            label: space.label,
            name: space.name,
          },
        },
      },
    });
  }

  updateById(id: string, updateGymDto: UpdateGymDto) {
    return this.repository.update({
      where: { id },
      data: updateGymDto,
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

  deleteById(id: string) {
    return this.repository.delete({
      where: { id },
    });
  }

  removeById(id: string) {
    return this.repository.update({
      where: { id },
      data: { removedAt: new Date() },
    });
  }
}
