import { Injectable } from '@nestjs/common';
import { Prisma, QueryCategoryDto, UpdateCategoryDto } from '@shared/schema';
import { ContextProvider } from '../provider';
import { CategoriesRepository } from '../repository/categories.repository';
import { AppLogger } from '../util/app-logger.util';

@Injectable()
export class CategoriesService {
  private readonly logger = new AppLogger(CategoriesService.name);
  constructor(private readonly repository: CategoriesRepository) {}

  async create(args: Prisma.CategoryCreateArgs) {
    const services = await this.repository.create(args);
    return services;
  }

  getFirst(args: Prisma.CategoryFindFirstArgs) {
    return this.repository.findFirst(args);
  }

  getUnique(args: Prisma.CategoryFindUniqueArgs) {
    return this.repository.findUnique(args);
  }

  findCategoryById(id: string) {
    return this.repository.findUnique({
      where: { id },
    });
  }

  updateById(id: string, updateCategoryDto: UpdateCategoryDto) {
    return this.repository.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  deleteById(categoryId: string) {
    return this.repository.delete({
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
      throw new Error('Tenant information not found in context. Please log in again.');
    }
    if (!currentTenant.spaceId) {
      this.logger.warn('getManyByQuery - No spaceId in tenant:', {
        tenantId: currentTenant.id?.slice(-8),
        hasSpaceId: !!currentTenant.spaceId,
      });
      throw new Error('Space ID is missing from tenant information. Please select a space.');
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
    const categories = await this.repository.findMany(args);
    const count = await this.repository.count(countArgs);

    return {
      categories,
      count,
    };
  }
}
