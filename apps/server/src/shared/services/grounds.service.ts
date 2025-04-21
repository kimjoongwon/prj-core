import { Injectable } from '@nestjs/common';
import { GroundsRepository } from '../repositories/grounds.repository';
import { CreateGroundDto, GroundQueryDto, UpdateGroundDto } from '../dtos';

@Injectable()
export class GroundsService {
  constructor(private readonly repository: GroundsRepository) {}

  getById(id: string) {
    return this.repository.findUnique({
      where: { id },
    });
  }

  removeManyByIds(ids: string[]) {
    return this.repository.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: { removedAt: new Date() },
    });
  }

  create(createGroundDto: CreateGroundDto) {
    return this.repository.create({
      data: createGroundDto,
    });
  }

  updateById(id: string, updateGroundDto: UpdateGroundDto) {
    return this.repository.update({
      where: { id },
      data: updateGroundDto,
    });
  }

  async getManyByQuery(query: GroundQueryDto) {
    const args = query.toArgs();
    const countArgs = query.toCountArgs();
    const grounds = await this.repository.findMany(args);
    const count = await this.repository.count(countArgs);
    return {
      grounds,
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
