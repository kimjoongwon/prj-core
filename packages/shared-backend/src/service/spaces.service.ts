import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationUtil } from '@shared/schema';
import { SpacesRepository } from '../repository/spaces.repository';
import { UpdateSpaceDto } from '../dto/update/update-space.dto';
import { QuerySpaceDto } from '../dto/query/query-space.dto';
import { CreateSpaceDto } from '../dto/create/create-space.dto';

@Injectable()
export class SpacesService {
  constructor(private readonly repository: SpacesRepository) {}

  async create(createSpaceDto: CreateSpaceDto) {
    const space = await this.repository.create({
      data: {
        ...createSpaceDto,
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

  async getManyByQuery(query: QuerySpaceDto) {
    const args = PaginationUtil.toArgs(query);
    const spaceCount = await this.repository.count(args);
    const spaces = await this.repository.findMany(args);
    return {
      count: spaceCount,
      spaces,
    };
  }

  getCurrentSpace(spaceId: string) {
    return this.repository.findUnique({
      where: { id: spaceId },
      include: {
        ground: true,
      },
    });
  }
}
