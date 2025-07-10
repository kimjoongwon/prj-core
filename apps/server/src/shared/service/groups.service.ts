import { Injectable } from '@nestjs/common';
import type { CreateGroupDto, Prisma, QueryGroupDto, UpdateGroupDto } from '@shared/schema';
import type { GroupsRepository } from '../repository/groups.repository';

@Injectable()
export class GroupsService {
  constructor(private readonly repository: GroupsRepository) {}
  create(createGroupDto: CreateGroupDto) {
    return this.repository.create({ data: createGroupDto });
  }

  async getManyByQuery(query: QueryGroupDto) {
    const args = query.toArgs<Prisma.GroupFindManyArgs>({
      orderBy: {
        createdAt: 'desc',
      },
    });

    const countArgs = query.toCountArgs<Prisma.GroupCountArgs>();
    const groups = await this.repository.findMany(args);
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
