import { Injectable } from '@nestjs/common';
import { GymsRepository } from '../repositories';
import { CreateGymDto, GymQueryDto, UpdateGymDto } from '../dtos';
import { Prisma } from '@prisma/client';
import { ContextProvider } from '../providers';

@Injectable()
export class GymsService {
  constructor(private readonly repository: GymsRepository) {}

  async getMyGyms() {
    const userId = ContextProvider.getAuthUserId();
    const gyms = await this.repository.findMyGyms(userId);
    return gyms;
  }

  getById(id: string) {
    return this.repository.findUnique({
      where: { id },
    });
  }

  removeManyByIds(gymIds: string[]) {
    return this.repository.updateMany({
      where: {
        id: {
          in: gymIds,
        },
      },
      data: { removedAt: new Date() },
    });
  }

  create({ categoryId, ...data }: CreateGymDto) {
    const tenantId = ContextProvider.getTenantId();
    return this.repository.create({
      data: {
        name: data.name,
        label: data.label,
        address: data.address,
        phone: data.phone,
        businessNo: data.businessNo,
        email: data.email,
        depot: {
          connect: {
            id: data.depotId,
          },
        },
        space: {},
      },
    });
  }

  updateById(id: string, { space, depotId, ...updateGymDto }: UpdateGymDto) {
    return this.repository.update({
      where: { id },
      data: {
        ...updateGymDto,
      },
    });
  }

  async getManyByTenantId(tenantId: string) {
    const gyms = await this.repository.findMany({
      where: {
        space: {
          tenants: {
            some: {
              id: tenantId,
            },
          },
        },
      },
      include: {
        space: {
          include: {
            tenants: true,
          },
        },
      },
    });

    return gyms;
  }

  async getManyByQuery(query: GymQueryDto) {
    const args = query.toArgs() as Prisma.GymFindManyArgs;
    const countArgs = query.toCountArgs();
    const gyms = await this.repository.findMany({ ...args, include: { space: true } });
    const count = await this.repository.count(countArgs);
    return {
      gyms,
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
