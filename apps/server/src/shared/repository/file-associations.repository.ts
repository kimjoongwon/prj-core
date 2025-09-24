import { Injectable } from "@nestjs/common";
import { FileAssociation, Prisma } from "@shared/schema";
import { BaseRepository } from "../common/base.repository";
import { UseEntity } from "../decorator/use-dto.decorator";
import { PrismaService } from "../service/prisma.service";

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
		super(prisma, "FileAssociation");
	}
}
