import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import {
  $Enums,
  Prisma,
  QueryCategoryDto,
  UpdateCategoryDto,
} from '@shared/schema';
import { CategoriesRepository } from '../repository';
import { AppLogger } from '../util/app-logger.util';
import { ContextProvider } from '../provider';

@Injectable()
export class CategoriesService {
  private readonly logger = new AppLogger(CategoriesService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly repository: CategoriesRepository,
  ) {}

  async create(args: Prisma.CategoryCreateArgs) {
    const services = await this.prisma.category.create(args);
    return services;
  }

  getFirst(args: Prisma.CategoryFindFirstArgs) {
    return this.prisma.category.findFirst(args);
  }

  createMany(args: Prisma.CategoryCreateManyArgs) {
    return this.prisma.category.createMany(args);
  }

  getUnique(args: Prisma.CategoryFindUniqueArgs) {
    return this.prisma.category.findUnique(args);
  }

  findCategoryById(id: string) {
    return this.prisma.category.findUnique({
      where: { id },
    });
  }

  updateById(id: string, updateCategoryDto: UpdateCategoryDto) {
    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  getMany(args: Prisma.CategoryFindManyArgs) {
    return this.prisma.category.findMany(args);
  }

  deleteById(categoryId: string) {
    return this.prisma.category.delete({
      where: { id: categoryId },
    });
  }

  async getManyByQuery(query: QueryCategoryDto) {
    const currentTenant = ContextProvider.getTenant();
    this.logger.debug('getManyByQuery - Current Tenant:', {
      tenantId: currentTenant?.id?.slice(-8) || 'null',
      spaceId: currentTenant?.spaceId?.slice(-8) || 'null',
      timestamp: new Date().toISOString(),
    });
    if (!currentTenant) {
      this.logger.warn('getManyByQuery - No tenant found in context');
      throw new Error(
        'Tenant information not found in context. Please log in again.',
      );
    }
    if (!currentTenant.spaceId) {
      this.logger.warn('getManyByQuery - No spaceId in tenant:', {
        tenantId: currentTenant.id?.slice(-8),
        hasSpaceId: !!currentTenant.spaceId,
      });
      throw new Error(
        'Space ID is missing from tenant information. Please select a space.',
      );
    }
    this.logger.debug('getManyByQuery - Query Args:', {
      args: query.toArgs<Prisma.CategoryFindManyArgs>({
        where: {
          parent: null,
          tenant: {
            spaceId: currentTenant.spaceId,
          },
        },
        include: {
          children: {
            include: {
              children: {
                include: {
                  children: true,
                },
              },
            },
          },
        },
      }),
      countArgs: query.toCountArgs<Prisma.CategoryCountArgs>(),
    });
    const args = query.toArgs<Prisma.CategoryFindManyArgs>({
      where: {
        parent: null,
        tenant: {
          spaceId: currentTenant?.spaceId,
        },
      },
      include: {
        children: {
          include: {
            children: {
              include: {
                children: true,
              },
            },
          },
        },
      },
    });

    const countArgs = query.toCountArgs<Prisma.CategoryCountArgs>();
    const categories = await this.prisma.category.findMany(args);
    const count = await this.prisma.category.count(countArgs);

    return {
      categories,
      count,
    };
  }
}
