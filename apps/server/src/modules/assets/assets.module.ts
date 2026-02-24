import { SpaceContext } from "@cocrepo/service";
import { AlbumRepository, AssetRepository, FolderRepository } from "@cocrepo/repository";
import { Module } from "@nestjs/common";
import { AlbumController } from "./controllers/album.controller";
import { AssetController } from "./controllers/asset.controller";
import { FolderController } from "./controllers/folder.controller";
import { AlbumService } from "./services/album.service";
import { AssetService } from "./services/asset.service";
import { FolderService } from "./services/folder.service";

@Module({
	providers: [
		AssetService,
		AssetRepository,
		FolderService,
		FolderRepository,
		AlbumService,
		AlbumRepository,
		SpaceContext,
	],
	controllers: [AssetController, FolderController, AlbumController],
	exports: [AssetService, FolderService, AlbumService],
})
export class AssetsModule {}
