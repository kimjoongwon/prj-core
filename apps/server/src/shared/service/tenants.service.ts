import { Injectable } from '@nestjs/common';
import { TenantsRepository } from '../repository';
import { CreateTenantDto, UpdateTenantDto, QueryTenantDto } from '../dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TenantsService {
  constructor(private readonly repository: TenantsRepository) {}

  async create(createTenantDto: CreateTenantDto) {
    return this.repository.create({
      data: createTenantDto,
    });
  }

  async getManyByQuery(query: QueryTenantDto) {
    const args = query.toArgs() as Prisma.TenantFindManyArgs;
    args.include = {
      space: {
        include: {
          workspace: {
            include: {
              ground: true,
            },
          },
        },
      },
    };
    const countArgs = query.toCountArgs();
    const tenants = await this.repository.findMany(args);
    const count = await this.repository.count(countArgs);

    return {
      tenants,
      count,
    };
  }

  getById(id: string) {
    return this.repository.findUnique({ where: { id } });
  }

  updateById(id: string, updateTenantDto: UpdateTenantDto) {
    return this.repository.update({
      where: { id },
      data: updateTenantDto,
    });
  }

  deleteById(id: string) {
    return this.repository.delete({ where: { id } });
  }

  removeById(id: string) {
    return this.repository.update({
      where: { id },
      data: { removedAt: new Date() },
    });
  }
}
