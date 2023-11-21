import { Injectable } from '@nestjs/common';
import { last } from 'lodash';
import { PrismaService } from '../global/prisma/prisma.service';
import { queryBuilder } from '../../common/utils';
import { CreateSpaceInput } from './dto/create-space.input';
import { GetSpacesArgs } from './dto/get-spaces.args';
import { UpdateSpaceInput } from './dto/update-space.input';
import { PaginatedSpace } from './models/paginated-space.model';
import { SpaceForm } from './models/space-form.model';

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

  async getServiceOptions() {
    const serviceOptions = (await this.prisma.space.findMany({})).map(
      space => ({
        name: space.name,
        value: space.id,
      }),
    );

    return serviceOptions;
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
