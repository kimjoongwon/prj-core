import { FolderAggregateRoot } from "@cocrepo/aggregate";
import { FoldersRepository } from "@cocrepo/repository";
import { AuthContext, SpaceContext } from "@cocrepo/service";
import { FolderCommandHandlers, FolderQueryHandlers } from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { FoldersController } from "./folders.controller";

@Module({
	imports: [CqrsModule],
	controllers: [FoldersController],
	providers: [
		FolderAggregateRoot,
		FoldersRepository,
		AuthContext,
		SpaceContext,
		...FolderCommandHandlers,
		...FolderQueryHandlers,
	],
})
export class FoldersModule {}
