import { Injectable } from '@nestjs/common';
import type { Prisma, QueryUserAssociationDto } from '@shared/schema';
import type { CreateUserAssociationDto } from '@shared/schema';
import type { UserAssociationsRepository } from '../repository/user-associations.repository';

@Injectable()
export class UserAssociationsService {
  constructor(private readonly repository: UserAssociationsRepository) {}

  getUnique(args: Prisma.UserAssociationFindUniqueArgs) {
    return this.repository.findUnique(args);
  }

  getFirst(args: Prisma.UserAssociationFindFirstArgs) {
    return this.repository.findFirst(args);
  }

  updateMany(args: Prisma.UserAssociationUpdateManyArgs) {
    return this.repository.updateMany(args);
  }

  deleteById(id: string) {
    return this.repository.delete({ where: { id } });
  }

  create(createUserAssociationDto: CreateUserAssociationDto) {
    return this.repository.create({
      data: createUserAssociationDto,
    });
  }

  async getManyByQuery(query: QueryUserAssociationDto) {
    const include = {
      user: true,
      group: true,
    };
    const args = query.toArgs({ include });
    const countArgs = query.toCountArgs<Prisma.UserAssociationCountArgs>();
    const userAssociations = await this.repository.findMany(args);
    const count = await this.repository.count(countArgs);
    return {
      userAssociations,
      count,
    };
  }

  update(args: Prisma.UserAssociationUpdateArgs) {
    return this.repository.update(args);
  }

  remove(id: string) {
    return this.repository.update({
      where: { id },
      data: { removedAt: new Date() },
    });
  }
}
