import { Injectable } from '@nestjs/common';
import { CreateAbilityDto } from './dto/create-ability.dto';
import { UpdateAbilityDto } from './dto/update-ability.dto';
import { AbilitiesRepository } from './abilities.repository';
import { PaginationMananger } from '../../utils';
import { AbilityQueryDto } from './dto/ability-query.dto';

@Injectable()
export class AbilitiesService {
  constructor(private repository: AbilitiesRepository) {}
  create(createAbilityDto: CreateAbilityDto) {
    return this.repository.create(createAbilityDto);
  }

  getManyByQuery(pageQuery: AbilityQueryDto) {
    const args = PaginationMananger.toArgs(pageQuery);
    return this.repository.findMany(args);
  }

  get(id: string) {
    return this.repository.findUnique({ where: { id } });
  }

  update(id: string, updateAbilityDto: UpdateAbilityDto) {
    return this.repository.update({ where: { id }, data: updateAbilityDto });
  }

  remove(id: string) {
    return this.repository.update({ where: { id }, data: { removedAt: new Date() } });
  }

  removeMany(ids: string[]) {
    return this.repository.updateMany({
      where: { id: { in: ids } },
      data: { removedAt: new Date() },
    });
  }

  delete(id: string) {
    return this.repository.delete({ where: { id } });
  }
}
