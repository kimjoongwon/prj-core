import {
	AuthContext,
	SpaceContext,
} from "@cocrepo/context";
import { AssetAggregate } from "@cocrepo/aggregate";
import { AssetsController } from "@cocrepo/controller";
import { AssetsRepository, FoldersRepository } from "@cocrepo/repository";
import {
	ObjectStorageService,
	S3CompatibleStorageService,
} from "@cocrepo/service";
import { AssetCommandHandlers, AssetQueryHandlers } from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

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
