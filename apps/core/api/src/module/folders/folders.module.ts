import { FolderFacade } from "@cocrepo/facade";
import { FoldersRepository } from "@cocrepo/repository";
import { FolderService, SpaceContext } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { FoldersController } from "./folders.controller";

@Module({
	controllers: [FoldersController],
	providers: [FolderFacade, FolderService, FoldersRepository, SpaceContext],
	exports: [FolderFacade],
})
export class FoldersModule {}
