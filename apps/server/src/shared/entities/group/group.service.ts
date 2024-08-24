import { Injectable } from '@nestjs/common';
import { GroupRepository } from './group.repository';
import { CreateGroupDto } from './dtos/create-group.dto';
import { GroupQueryDto } from './dtos/group-query.dto';
import { UpdateGroupDto } from './dtos/update-group.dto';
import { PaginationMananger } from 'src/shared/utils';

@Injectable()
export class GroupService {
  constructor(private readonly repository: GroupRepository) {}
  create(createGroupDto: CreateGroupDto) {
    return this.repository.create({ data: createGroupDto });
  }

  async getManyByQuery(query: GroupQueryDto) {
    const args = PaginationMananger.toArgs(query);
    const groups = await this.repository.findManyByQuery(args);
    const count = await this.repository.count(query);
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
