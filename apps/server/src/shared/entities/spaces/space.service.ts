import { Injectable } from '@nestjs/common';
import { ContextProvider } from '../../providers/context.provider';
import { SpaceRepository } from './space.repository';
import { CreateSpaceDto } from './dtos/create-space.dto';
import { IService } from '../../types/interfaces/service.interface';
import { SpaceQueryDto, UpdateSpaceDto } from './dtos';
import { PaginationMananger } from '../../utils';
import { TenancyService } from '../tenancy';

@Injectable()
export class SpaceService implements IService {
  constructor(
    private readonly repository: SpaceRepository,
    private readonly tenancyService: TenancyService,
  ) {}

  create(createSpaceDto: CreateSpaceDto) {
    return this.tenancyService.create(createSpaceDto);
  }

  update(spaceId: string, updateSpaceDto: UpdateSpaceDto) {
    return this.repository.update({
      where: { id: spaceId },
      data: updateSpaceDto,
    });
  }

  getUnique(spaceId: string) {
    return this.repository.findUnique({ where: { id: spaceId } });
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
