import { Injectable } from '@nestjs/common';
import { CreateSpaceAssociationDto, Prisma, QuerySpaceAssociationDto } from '@shared/schema';
import { SpaceAssociationsRepository } from '../repository/space-associations.repository';

@Injectable()
export class SpaceAssociationsService {
  constructor(private readonly repository: SpaceAssociationsRepository) {}

  getUnique(args: Prisma.SpaceAssociationFindUniqueArgs) {
    return this.repository.findUnique(args);
  }

  getFirst(args: Prisma.SpaceAssociationFindFirstArgs) {
    return this.repository.findFirst(args);
  }

  updateMany(args: Prisma.SpaceAssociationUpdateManyArgs) {
    return this.repository.updateMany(args);
  }

  deleteById(id: string) {
    return this.repository.delete({ where: { id } });
  }

  create(createSpaceAssociationDto: CreateSpaceAssociationDto) {
    return this.repository.create({
      data: createSpaceAssociationDto,
    });
  }

  async getManyByQuery(query: QuerySpaceAssociationDto) {
    const include = {
      group: true,
    };
    const args = query.toArgs({ include });
    const countArgs = query.toCountArgs<Prisma.SpaceAssociationCountArgs>();
    const spaceAssociations = await this.repository.findMany(args);
    const count = await this.repository.count(countArgs);
    return {
      spaceAssociations,
      count,
    };
  }

  update(args: Prisma.SpaceAssociationUpdateArgs) {
    return this.repository.update(args);
  }

  remove(id: string) {
    return this.repository.update({
      where: { id },
      data: { removedAt: new Date() },
    });
  }
}
