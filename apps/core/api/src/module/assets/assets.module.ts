import { AssetFacade } from "@cocrepo/facade";
import { AssetsRepository, FoldersRepository } from "@cocrepo/repository";
import {
	AuthContext,
	AssetService,
	ObjectStorageService,
	S3CompatibleStorageService,
	SpaceContext,
} from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { AssetsController } from "./assets.controller";

@Module({
	controllers: [AssetsController],
	providers: [
		AssetFacade,
		AssetService,
		S3CompatibleStorageService,
		{
			provide: ObjectStorageService,
			useExisting: S3CompatibleStorageService,
		},
		AssetsRepository,
		FoldersRepository,
		AuthContext,
		SpaceContext,
	],
	exports: [AssetFacade],
})
export class AssetsModule {}
