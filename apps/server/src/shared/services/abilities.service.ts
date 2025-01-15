import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AbilitiesRepository } from '../repositories/abilities.repository';
import { AbilityQueryDto } from '../dtos/query/ability-query.dto';
import { CreateAbilityDto } from '../dtos';

@Injectable()
export class AbilitiesService {
  constructor(private readonly repository: AbilitiesRepository) {}

  getUnique(args: Prisma.AbilityFindUniqueArgs) {
    return this.repository.findUnique(args);
  }

  getFirst(args: Prisma.AbilityFindFirstArgs) {
    return this.repository.findFirst(args);
  }

  updateMany(args: Prisma.AbilityUpdateManyArgs) {
    return this.repository.updateMany(args);
  }

  deleteById(id: string) {
    return this.repository.delete({ where: { id } });
  }

  create(createAbilityDto: CreateAbilityDto) {
    return this.repository.create({
      data: createAbilityDto,
    });
  }

  async getManyByQuery(query: AbilityQueryDto) {
    const args = query.toArgs();
    const countArgs = query.toCountArgs();
    const abilities = await this.repository.findMany(args);
    const count = await this.repository.count(countArgs);
    return {
      abilities,
      count,
    };
  }

  update(args: Prisma.AbilityUpdateArgs) {
    return this.repository.update(args);
  }

  remove(id: string) {
    return this.repository.update({
      where: { id },
      data: { removedAt: new Date() },
    });
  }
}
