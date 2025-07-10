import { Injectable } from '@nestjs/common';
import type {
  CreateFileAssociationDto,
  FileAssociation,
  Prisma,
  QueryFileAssociationDto,
  UpdateFileAssociationDto,
} from '@shared/schema';
import type { FileAssociationsRepository } from '../repository/file-associations.repository';
import { BaseService } from './base.service';

@Injectable()
export class FileAssociationsService extends BaseService<
  CreateFileAssociationDto,
  UpdateFileAssociationDto,
  QueryFileAssociationDto,
  FileAssociation,
  FileAssociationsRepository,
  { file: boolean }
> {
  constructor(repository: FileAssociationsRepository) {
    super(repository, {
      includeMap: {
        getManyByQuery: { file: true },
      },
    });
  }

  // 기존 custom 메서드들 유지
  getUnique(args: Prisma.FileAssociationFindUniqueArgs) {
    return this.repository.findUnique(args);
  }

  getFirst(args: Prisma.FileAssociationFindFirstArgs) {
    return this.repository.findFirst(args);
  }

  updateMany(args: Prisma.FileAssociationUpdateManyArgs) {
    return this.repository.updateMany(args);
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

  // 기존 컨트롤러 호환성을 위한 별도 메서드
  async getFileAssociationsByQuery(query: QueryFileAssociationDto) {
    const result = await this.getManyByQuery(query);
    return {
      fileAssociations: result.items,
      count: result.count,
    };
  }
}
