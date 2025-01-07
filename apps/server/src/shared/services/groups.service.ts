import { Injectable } from '@nestjs/common';
import { GroupsRepository } from '../../_repo/groups.repository';
import { CreateGroupDto } from './dtos/create-group.dto';
import { UpdateGroupDto } from './dtos/update-group.dto';
import { Prisma } from '@prisma/client';
import { GroupQueryDto } from './dtos';

@Injectable()
export class GroupsService {
  constructor(private readonly repository: GroupsRepository) {}
  create(createGroupDto: CreateGroupDto) {
    return this.repository.create({ data: createGroupDto });
  }

  async getManyByQuery(query: GroupQueryDto) {
    const args = query.toArgs<Prisma.GroupFindManyArgs>();
    const countArgs = query.toCountArgs<Prisma.GroupCountArgs>();
    const groups = await this.repository.findManyByQuery(args);
    const totalCount = await this.repository.count(countArgs);

    return {
      totalCount,
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
