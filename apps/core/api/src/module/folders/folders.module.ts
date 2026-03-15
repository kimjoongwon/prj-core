import { FolderFacade } from "@cocrepo/facade";
import { FoldersRepository } from "@cocrepo/repository";
import { AuthContext, FolderService, SpaceContext } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { FoldersController } from "./folders.controller";

@Module({
	controllers: [FoldersController],
	providers: [
		FolderFacade,
		FolderService,
		FoldersRepository,
		AuthContext,
		SpaceContext,
	],
	exports: [FolderFacade],
})
export class FoldersModule {}
