import { Injectable } from '@nestjs/common';
import { TenantsRepository } from '../repository';
import { CreateTenantDto, UpdateTenantDto, QueryTenantDto } from '../dto';
import { Tenant } from '../entity';
import { Prisma } from '@prisma/client';
import { Logger } from 'nestjs-pino';
import { ContextProvider } from '../provider';

@Injectable()
export class TenantsService {
  constructor(
    private readonly tenantsRepository: TenantsRepository,
    readonly logger: Logger,
  ) {}

  async create(createTenantDto: CreateTenantDto): Promise<Tenant> {
    return this.tenantsRepository.create({
      data: createTenantDto,
      include: {
        space: {
          include: {
            ground: true,
          },
        },
        user: true,
        role: true,
      },
    });
  }

  async getById(id: string): Promise<Tenant> {
    const args: any = {
      where: { id },
      include: {
        space: {
          include: {
            ground: true,
          },
        },
        user: true,
        role: true,
      },
    };
    this.logger.log(`Fetching tenant with ID: ${id}`, 'TenantsService');
    return this.tenantsRepository.findUnique(args);
  }

  async updateById(id: string, updateTenantDto: UpdateTenantDto): Promise<Tenant> {
    const args: any = {
      where: { id },
      data: updateTenantDto,
      include: {
        space: {
          include: {
            ground: true,
          },
        },
        user: true,
        role: true,
      },
    };
    return this.tenantsRepository.update(args);
  }

  async removeById(id: string): Promise<Tenant> {
    const args: any = {
      where: { id },
      data: { removedAt: new Date() },
      include: {
        space: {
          include: {
            ground: true,
          },
        },
        user: true,
        role: true,
      },
    };
    return this.tenantsRepository.update(args);
  }

  async deleteById(id: string): Promise<Tenant> {
    return this.tenantsRepository.delete({
      where: { id },
    });
  }

  async getManyByQuery(query: QueryTenantDto): Promise<{ tenants: Tenant[]; count: number }> {
    const currentUser = ContextProvider.getAuthUser();
    console.log('Current User:', currentUser);
    const args = query?.toArgs({
      where: {
        userId: currentUser?.id,
      },
      include: {
        space: {
          include: {
            ground: true,
          },
        },
        user: true,
        role: true,
      },
    }) as Prisma.TenantFindManyArgs;

    const countArgs = query.toCountArgs();
    const tenants = await this.tenantsRepository.findMany(args);
    const count = await this.tenantsRepository.count(countArgs);

    return {
      tenants,
      count,
    };
  }
}
