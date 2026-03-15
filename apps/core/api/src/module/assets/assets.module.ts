import { AssetFacade } from "@cocrepo/facade";
import { AssetsRepository, FoldersRepository } from "@cocrepo/repository";
import { AssetService, SpaceContext } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { AssetsController } from "./assets.controller";

@Module({
	controllers: [AssetsController],
	providers: [
		AssetFacade,
		AssetService,
		AssetsRepository,
		FoldersRepository,
		SpaceContext,
	],
	exports: [AssetFacade],
})
export class AssetsModule {}
