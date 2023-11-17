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
    if (id === 'new') {
      return {
        name: '',
        address: '',
        phone: '',
      };
    }

    return this.prisma.space.findUnique({
      where: { id },
    });
  }

  async findPaginatedSpace(args: GetSpacesArgs): Promise<PaginatedSpace> {
    const query = queryBuilder(args, []);

    const spaces = await this.prisma.space.findMany({});

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
    console.log('updateCategoryInput', updateCategoryInput);
    return this.prisma.space.update({
      where: { id: updateCategoryInput.id },
      data: updateCategoryInput,
    });
  }
}
