import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { FileAssociationsRepository } from '../repository/file-associations.repository';
import { QueryFileAssociationDto } from '../dto/query/query-file-association.dto';
import { CreateFileAssociationDto } from '../dto';

@Injectable()
export class FileAssociationsService {
  constructor(private readonly repository: FileAssociationsRepository) {}

  getUnique(args: Prisma.FileAssociationFindUniqueArgs) {
    return this.repository.findUnique(args);
  }

  getFirst(args: Prisma.FileAssociationFindFirstArgs) {
    return this.repository.findFirst(args);
  }

  updateMany(args: Prisma.FileAssociationUpdateManyArgs) {
    return this.repository.updateMany(args);
  }

  deleteById(id: string) {
    return this.repository.delete({ where: { id } });
  }

  create(createFileAssociationDto: CreateFileAssociationDto) {
    return this.repository.create({
      data: createFileAssociationDto,
    });
  }

  async getManyByQuery(query: QueryFileAssociationDto) {
    const include = {
      file: true,
    };
    const args = query.toArgs({ include });
    const countArgs = query.toCountArgs();
    const fileAssociations = await this.repository.findMany(args);
    const count = await this.repository.count(countArgs);
    return {
      fileAssociations,
      count,
    };
  }

  update(args: Prisma.FileAssociationUpdateArgs) {
    return this.repository.update(args);
  }

  remove(id: string) {
    return this.repository.update({
      where: { id },
      data: { removedAt: new Date() },
    });
  }
}
