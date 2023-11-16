import { Injectable } from '@nestjs/common';
import { last } from 'lodash';
import { queryBuilder } from '@common';
import { PaginatedSpace, SpaceForm } from './models/index';
import { CreateSpaceInput, GetSpacesArgs, UpdateSpaceInput } from './dto/index';
import { PrismaService } from '@modules/global/prisma/prisma.service';

@Injectable()
export class SpacesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createSpaceInput: CreateSpaceInput) {
    return this.prisma.space.create({
      data: createSpaceInput,
    });
  }

  async findForm(id: string): Promise<SpaceForm> {
    console.log('id', id);
    if (id === 'new') {
      return {
        ownerId: '',
        name: '',
        address: '',
        phone: '',
      };
    }

    const space = await this.prisma.space.findUnique({
      where: { id },
    });

    return {
      address: space.address,
      name: space.name,
      phone: space.phone,
      ownerId: space.ownerId,
    };
  }

  async findPaginatedSpace(args: GetSpacesArgs): Promise<PaginatedSpace> {
    const query = queryBuilder(args, []);

    const spaces = await this.prisma.space.findMany({
      ...query,
    });

    const totalCount = await this.prisma.space.count({
      where: query?.where,
    });

    const endCursor = last(spaces)?.id;

    return {
      edges: spaces.map(space => ({ node: space })),
      nodes: spaces,
      pageInfo: {
        totalCount,
        endCursor,
        hasNextPage: !(spaces.length < args.take),
      },
    };
  }

  delete(id: string) {
    return this.prisma.space.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  findOne(id: string) {
    return this.prisma.space.findUnique({
      where: { id },
    });
  }

  update(updateCategoryInput: UpdateSpaceInput) {
    return this.prisma.space.update({
      where: { id: updateCategoryInput.id },
      data: updateCategoryInput,
    });
  }
}
