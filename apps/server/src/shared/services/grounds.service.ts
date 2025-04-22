import { Injectable } from '@nestjs/common';
import { GroundsRepository } from '../repositories/grounds.repository';
import { CreateGroundDto, GroundQueryDto, UpdateGroundDto } from '../dtos';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class GroundsService {
  constructor(
    private readonly repository: GroundsRepository,
    private readonly prisma: PrismaService,
  ) {}

  getById(id: string) {
    return this.repository.findUnique({
      where: { id },
      include: {
        workspace: {
          include: {
            space: true,
          },
        },
      },
    });
  }

  removeManyByIds(ids: string[]) {
    return this.repository.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: { removedAt: new Date() },
    });
  }

  create({
    workspace: { address, businessNo, email, label, logoImageDepotId, name, phone },

    imageDepotId,
  }: CreateGroundDto) {
    const args: Prisma.GroundCreateArgs = {
      data: {
        workspace: {
          create: {
            address,
            businessNo,
            email,
            label,
            name,
            phone,
            space: {
              create: {},
            },
          },
        },
      },
    };

    if (logoImageDepotId) {
      args.data.workspace.create.logoImageDepot = {
        connect: {
          id: logoImageDepotId,
        },
      };
    }

    if (imageDepotId) {
      args.data.imageDepot = {
        connect: {
          id: imageDepotId,
        },
      };
    }

    return this.repository.create(args);
  }

  updateById(
    id: string,
    { workspace: { address, businessNo, email, label, name, phone } }: UpdateGroundDto,
  ) {
    return this.repository.update({
      where: { id },
      data: {
        workspace: {
          update: {
            address,
            businessNo,
            email,
            label,
            name,
            phone,
          },
        },
      },
    });
  }

  async getManyByQuery(query: GroundQueryDto) {
    const args = query.toArgs<Prisma.GroundFindManyArgs>({
      include: {
        workspace: {
          include: {
            space: true,
          },
        },
      },
    });
    const countArgs = query.toCountArgs();
    const grounds = await this.repository.findMany(args);
    console.log('grounds', grounds);
    const count = await this.repository.count(countArgs);
    return {
      grounds,
      count,
    };
  }

  deleteById(id: string) {
    return this.repository.delete({
      where: { id },
    });
  }

  removeById(id: string) {
    return this.repository.update({
      where: { id },
      data: { removedAt: new Date() },
    });
  }
}
