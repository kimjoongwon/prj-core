import { Injectable } from '@nestjs/common';
import { GymsRepository } from '../repositories/Gyms.repository';
import { CreateGymDto, GymQueryDto, UpdateGymDto } from '../dtos';

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

  create(createGymDto: CreateGymDto) {
    return this.repository.create({
      data: createGymDto,
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
