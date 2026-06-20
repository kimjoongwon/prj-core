import { AssetAggregate } from "@cocrepo/aggregate";
import { AssetsRepository, FoldersRepository } from "@cocrepo/repository";
import {
	AuthContext,
	ObjectStorageService,
	S3CompatibleStorageService,
	SpaceContext,
} from "@cocrepo/service";
import { AssetCommandHandlers, AssetQueryHandlers } from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { AssetsController } from "@cocrepo/controller";

@Module({
	imports: [CqrsModule],
	controllers: [AssetsController],
	providers: [
		AssetAggregate,
		S3CompatibleStorageService,
		{
			provide: ObjectStorageService,
			useExisting: S3CompatibleStorageService,
		},
		AssetsRepository,
		FoldersRepository,
		AuthContext,
		SpaceContext,
		...AssetCommandHandlers,
		...AssetQueryHandlers,
	],
})
export class AssetsModule {}
