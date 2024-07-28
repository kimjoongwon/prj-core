import { Injectable } from '@nestjs/common';
import { CreateAbilityDto } from './dto/create-ability.dto';
import { UpdateAbilityDto } from './dto/update-ability.dto';
import { AbilitiesRepository } from './abilities.repository';
import { AbilityPageQuery } from './dto/ability-page-options.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AbilitiesService {
  constructor(private repository: AbilitiesRepository) {}
  create(createAbilityDto: CreateAbilityDto) {
    return this.repository.create(createAbilityDto);
  }

  getAbilitiesByPageOptions(pageQuery: AbilityPageQuery) {
    const query = pageQuery.toArgs() as Prisma.AbilityFindManyArgs;
    console.log('query', query);
    return this.repository.findMany(query);
  }

  findOne(id: number) {
    return `This action returns a #${id} ability`;
  }

  update(id: number, updateAbilityDto: UpdateAbilityDto) {
    return `This action updates a #${id} ability`;
  }

  remove(id: number) {
    return `This action removes a #${id} ability`;
  }
}
