import { Injectable } from '@nestjs/common';
import { last } from 'lodash';
import { PrismaService } from '../global/prisma/prisma.service';
import { queryBuilder } from '../../common/utils';
import { CreateSpaceInput } from './dto/create-space.input';
import { GetSpacesArgs } from './dto/get-spaces.args';
import { UpdateSpaceInput } from './dto/update-space.input';
import { PaginatedSpace } from './models/paginated-space.model';
import { SpaceForm } from './models/space-form.model';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../../configs';

@Injectable()
export class SpacesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

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

  findAppSpace() {
    const appConfig = this.configService.get<AppConfig>('app');
    const appName = appConfig.name;
    return this.prisma.space.findFirst({
      where: { name: appName },
    });
  }

  createPromiseSpace() {
    const appConfig = this.configService.get<AppConfig>('app');
    const data: CreateSpaceInput = {
      name: appConfig.name,
      address: '프로미스',
      phone: '01073162347',
    };

    return this.prisma.space.create({ data });
  }

  async getSpaceOptions() {
    const spaceOptions = (await this.prisma.space.findMany({})).map(
      space => ({
        text: space.name,
        value: space.id,
      }),
    );

    return spaceOptions;
  }

  async findPaginatedSpace(
    args: GetSpacesArgs,
  ): Promise<PaginatedSpace> {
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
    return this.prisma.space.update({
      where: { id: updateCategoryInput.id },
      data: updateCategoryInput,
    });
  }
}
