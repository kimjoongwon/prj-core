import { Injectable } from "@nestjs/common";
import { FileClassification, Prisma } from "@shared/schema";
import { PrismaService } from "../service/prisma.service";
import { BaseRepository } from "../common/base.repository";
import { UseEntity } from "../decorator/use-dto.decorator";

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
		super(prisma, "FileClassification");
	}
}
