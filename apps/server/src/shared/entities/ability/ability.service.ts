import { Injectable } from '@nestjs/common';
import { CreateAbilityDto } from './dto/create-ability.dto';
import { UpdateAbilityDto } from './dto/update-ability.dto';
import { AbilityPageQueryDto } from './dto/ability-page-query.dto';
import { AbilityRepository } from './ability.repository';
import { PaginationMananger } from 'src/shared/utils';
import { Prisma } from '@prisma/client';

@Injectable()
export class AbilityService {
  constructor(private repository: AbilityRepository) {}
  create(createAbilityDto: CreateAbilityDto) {
    return this.repository.create(createAbilityDto);
  }

  getAbilitiesByPageQuery(pageQuery: AbilityPageQueryDto) {
    const args = PaginationMananger.toArgs(pageQuery);
    return this.repository.findMany(args);
  }

  getOneById(id: string) {
    return this.repository.findUnique({ where: { id } });
  }

  updateById(id: string, updateAbilityDto: UpdateAbilityDto) {
    return this.repository.update({ where: { id }, data: updateAbilityDto });
  }

  removeById(id: string) {
    return this.repository.delete({ where: { id } });
  }
}
