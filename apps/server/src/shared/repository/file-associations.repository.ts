import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { UseEntity } from '../decorator/use-dto.decorator';
import { BaseRepository } from '../common/base.repository';
import { FileAssociation } from '../entity/file-association.entity';

@Injectable()
@UseEntity(FileAssociation)
export class FileAssociationsRepository extends BaseRepository<
  Prisma.FileAssociationCreateArgs,
  Prisma.FileAssociationUpsertArgs,
  Prisma.FileAssociationUpdateArgs,
  Prisma.FileAssociationUpdateManyArgs,
  Prisma.FileAssociationDeleteArgs,
  Prisma.FileAssociationFindManyArgs,
  Prisma.FileAssociationCountArgs,
  Prisma.FileAssociationAggregateArgs,
  Prisma.FileAssociationDeleteManyArgs,
  Prisma.FileAssociationFindFirstArgs,
  Prisma.FileAssociationFindUniqueArgs,
  Prisma.FileAssociationGroupByArgs,
  Prisma.FileAssociationCreateManyArgs,
  FileAssociation
> {
  constructor(prisma: PrismaService) {
    super(prisma, 'FileAssociation');
  }
}
