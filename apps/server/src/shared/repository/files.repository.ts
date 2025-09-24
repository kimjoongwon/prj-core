import { Injectable } from "@nestjs/common";
import { File, Prisma } from "@shared/schema";
import { BaseRepository } from "../common/base.repository";
import { UseEntity } from "../decorator/use-dto.decorator";
import { PrismaService } from "../service/prisma.service";

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
	Prisma.FileCreateManyAndReturnArgs,
	File
> {
	constructor(prisma: PrismaService) {
		super(prisma, "File");
	}
}
