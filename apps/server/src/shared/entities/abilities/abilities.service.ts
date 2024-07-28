import { Injectable } from '@nestjs/common';
import { CreateAbilityDto } from './dto/create-ability.dto';
import { UpdateAbilityDto } from './dto/update-ability.dto';
import { AbilityPageQueryDto } from './dto/ability-page-query.dto';
import { AbilitiesRepository } from './abilities.repository';
import { PaginationMananger } from 'src/shared/utils';
import { Prisma } from '@prisma/client';

@Injectable()
export class AbilitiesService {
  constructor(private repository: AbilitiesRepository) {}
  create(createAbilityDto: CreateAbilityDto) {
    return this.repository.create(createAbilityDto);
  }

  getAbilitiesByPageOptions(pageQuery: AbilityPageQueryDto) {
    const args = PaginationMananger.toArgs(pageQuery);
    return this.repository.findMany(args);
  }

  getAbilityById(id: string) {
    return this.repository.findUnique({ where: { id } });
  }

  update(id: string, updateAbilityDto: UpdateAbilityDto) {
    return this.repository.update({ where: { id }, data: updateAbilityDto });
  }

  remove(id: string) {
    return this.repository.delete({ where: { id } });
  }
}
