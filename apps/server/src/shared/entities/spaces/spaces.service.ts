import { Injectable } from '@nestjs/common';
import { ContextProvider } from '../../providers/context.provider';
import { SpacesRepository } from './spaces.repository';
import { CreateSpaceDto } from './dtos/create-space.dto';
import { IService } from '../../types/interfaces/service.interface';
import { SpaceQueryDto, UpdateSpaceDto } from './dtos';
import { PaginationMananger } from '../../utils';
import { Prisma } from '@prisma/client';

@Injectable()
export class SpacesService implements IService {
  constructor(private readonly repository: SpacesRepository) {}

  create(args: Prisma.SpaceCreateArgs) {
    return this.repository.create(args);
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
    const args = PaginationMananger.toArgs(query);
    const spaceCount = await this.repository.count(args);
    const spaces = await this.repository.findMany(args);
    return {
      count: spaceCount,
      spaces,
    };
  }

  createBaseSpace() {
    return this.repository.create({
      data: {
        name: '기본',
      },
    });
  }

  async findBaseSpace() {
    return this.repository.findUnique({
      where: {
        name: '기본',
      },
    });
  }

  async getAllSpace() {
    return this.repository.findMany({
      where: {
        removedAt: null,
      },
    });
  }

  async createOrUpdateGalaxySpace() {
    const name = 'Galaxy';
    return await this.repository.upsert({
      where: { name },
      update: { name },
      create: { name },
    });
  }

  getAccessibleSpaces() {
    const tenant = ContextProvider.getTenant();
    const spaceIds = tenant.tenants.map((tenant) => tenant.tenancy.spaceId);
    return this.repository.findMany({ where: { id: { in: spaceIds } } });
  }
}
