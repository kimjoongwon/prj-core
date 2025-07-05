import { Injectable } from '@nestjs/common';
import { Prisma } from '@shared/schema';
import { AbilitiesRepository } from '../repository/abilities.repository';
import { QueryAbilityDto, CreateAbilityDto } from '@shared/schema';

@Injectable()
export class AbilitiesService {
  constructor(private readonly repository: AbilitiesRepository) { }

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
      data: createAbilityDto as any,
    });
  }

  async getManyByQuery(query: QueryAbilityDto) {
    const args = query.toArgs<Prisma.AbilityFindManyArgs>();
    const countArgs = query.toCountArgs<Prisma.AbilityCountArgs>();
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
