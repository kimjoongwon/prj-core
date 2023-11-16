import { Injectable } from '@nestjs/common';
import { last } from 'lodash';
import { queryBuilder } from '@common';
import { PaginatedSpace, SpaceForm } from './models';
import { CreateSpaceInput, GetSpacesArgs, UpdateSpaceInput } from './dto';
import { PrismaService } from '@modules/global/prisma/prisma.service';

@Injectable()
export class SpacesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createSpaceInput: CreateSpaceInput) {
    return this.prisma.space.create({
      data: createSpaceInput,
    });
  }

  async findForm(id: string): Promise<any> {
    if (id === 'new') {
      return {
        ownerOptions: [],
      };
    }
    return {};
  }

  async findPaginatedSpace(args: GetSpacesArgs): Promise<PaginatedSpace> {
    const query = queryBuilder(args, []);

    const spaces = await this.prisma.space.findMany({
      include: {
        owner: true,
      },
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
