import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationUtil } from '@shared/utils';
import { SpacesRepository } from '../repositories/spaces.repository';
import { UpdateSpaceDto } from '../dtos/update/update-space.dto';
import { SpaceQueryDto } from '../dtos/query/space-query.dto';
import { CreateSpaceDto } from '../dtos';
import { ContextProvider } from '../providers';

@Injectable()
export class SpacesService {
  constructor(private readonly repository: SpacesRepository) {}

  async create({ categoryId, serviceId, ...createSpaceDto }: CreateSpaceDto) {
    const tenantId = ContextProvider.getTenantId();
    const space = await this.repository.create({
      data: {
        ...createSpaceDto,
        classification: {
          create: {
            serviceId,
            categoryId,
          },
        },
      },
    });

    return space;
  }

  update(spaceId: string, updateSpaceDto: UpdateSpaceDto) {
    return this.repository.update({
      where: { id: spaceId },
      data: updateSpaceDto,
    });
  }

  getUnique(args: Prisma.SpaceFindUniqueArgs) {
    return this.repository.findUnique(args);
  }

  getFirst(spaceId: string) {
    return this.repository.findFirst({
      where: { id: spaceId },
    });
  }

  remove(spaceId: string) {
    return this.repository.update({
      where: { id: spaceId },
      data: { removedAt: new Date() },
    });
  }

  removeMany(spaceIds: string[]) {
    return this.repository.updateMany({
      where: { id: { in: spaceIds } },
      data: { removedAt: new Date() },
    });
  }

  delete(spaceId: string) {
    return this.repository.delete({ where: { id: spaceId } });
  }

  async getManyByQuery(query: SpaceQueryDto) {
    const args = PaginationUtil.toArgs(query);
    const spaceCount = await this.repository.count(args);
    const spaces = await this.repository.findMany(args);
    return {
      count: spaceCount,
      spaces,
    };
  }
}
