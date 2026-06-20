import { FolderAggregate } from "@cocrepo/aggregate";
import { FoldersController } from "@cocrepo/controller";
import { FoldersRepository } from "@cocrepo/repository";
import { AuthContext, SpaceContext } from "@cocrepo/service";
import { FolderCommandHandlers, FolderQueryHandlers } from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

@Module({
	imports: [CqrsModule],
	controllers: [FoldersController],
	providers: [
		FolderAggregate,
		FoldersRepository,
		AuthContext,
		SpaceContext,
		...FolderCommandHandlers,
		...FolderQueryHandlers,
	],
})
export class FoldersModule {}
