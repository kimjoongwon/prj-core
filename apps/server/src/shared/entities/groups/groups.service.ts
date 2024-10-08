import { Injectable } from '@nestjs/common';
import { GroupsRepository } from './groups.repository';
import { CreateGroupDto } from './dtos/create-group.dto';
import { GroupQueryDto } from './dtos/group-query.dto';
import { UpdateGroupDto } from './dtos/update-group.dto';
import { PaginationMananger } from '../../../shared/utils';
import { Prisma } from '@prisma/client';

@Injectable()
export class GroupsService {
  constructor(private readonly repository: GroupsRepository) {}
  create(createGroupDto: CreateGroupDto) {
    return this.repository.create({ data: createGroupDto });
  }

  async getManyByQuery(args: Prisma.GroupFindManyArgs) {
    const groups = await this.repository.findManyByQuery(args);
    const count = await this.repository.count(args as Prisma.GroupCountArgs);
    return {
      count,
      groups,
    };
  }

  get(id: string) {
    return this.repository.findUnique({
      where: { id },
    });
  }

  update(id: string, updateDto: UpdateGroupDto) {
    return this.repository.update({
      where: {
        id: id,
      },
      data: updateDto,
    });
  }

  updateMany(ids: string[], updateDto: UpdateGroupDto) {
    return this.repository.updateMany({
      where: { id: { in: ids } },
      data: updateDto,
    });
  }

  remove(id: string) {
    return this.repository.update({
      where: { id },
      data: {
        removedAt: new Date(),
      },
    });
  }

  removeMany(ids: string[]) {
    return this.repository.updateMany({
      where: { id: { in: ids } },
      data: { removedAt: new Date() },
    });
  }

  delete(id: string) {
    return this.repository.delete({
      where: { id },
    });
  }
}
