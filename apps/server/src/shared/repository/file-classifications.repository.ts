import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { UseEntity } from '../decorator/use-dto.decorator';
import { BaseRepository } from '../common/base.repository';
import { FileClassification } from '../entity/file-classification.entity';

@Injectable()
@UseEntity(FileClassification)
export class FileClassificationsRepository extends BaseRepository<
  Prisma.FileClassificationCreateArgs,
  Prisma.FileClassificationUpsertArgs,
  Prisma.FileClassificationUpdateArgs,
  Prisma.FileClassificationUpdateManyArgs,
  Prisma.FileClassificationDeleteArgs,
  Prisma.FileClassificationFindManyArgs,
  Prisma.FileClassificationCountArgs,
  Prisma.FileClassificationAggregateArgs,
  Prisma.FileClassificationDeleteManyArgs,
  Prisma.FileClassificationFindFirstArgs,
  Prisma.FileClassificationFindUniqueArgs,
  Prisma.FileClassificationGroupByArgs,
  Prisma.FileClassificationCreateManyArgs,
  FileClassification
> {
  constructor(prisma: PrismaService) {
    super(prisma, 'FileClassification');
  }
}
