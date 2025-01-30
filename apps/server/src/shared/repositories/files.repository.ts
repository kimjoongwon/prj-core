import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { UseEntity } from '../decorators/use-dto.decorator';
import { BaseRepository } from '../common/base.repository';
import { File } from '../entities/file.entity';

@Injectable()
@UseEntity(File)
export class FilesRepository extends BaseRepository<
  Prisma.FileCreateArgs,
  Prisma.FileUpsertArgs,
  Prisma.FileUpdateArgs,
  Prisma.FileUpdateManyArgs,
  Prisma.FileDeleteArgs,
  Prisma.FileFindManyArgs,
  Prisma.FileCountArgs,
  Prisma.FileAggregateArgs,
  Prisma.FileDeleteManyArgs,
  Prisma.FileFindFirstArgs,
  Prisma.FileFindUniqueArgs,
  Prisma.FileGroupByArgs,
  Prisma.GroupCreateManyArgs,
  File
> {
  constructor(prisma: PrismaService) {
    super(prisma, 'File');
  }
}
