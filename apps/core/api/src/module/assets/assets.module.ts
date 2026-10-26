import { AssetAggregate } from "@cocrepo/aggregate";
import { SpaceContext } from "@cocrepo/context";
import { AssetsController } from "@cocrepo/controller";
import { AssetsRepository } from "@cocrepo/repository";
import {
	ObjectStorageService,
	S3CompatibleStorageService,
} from "@cocrepo/service";
import { AssetQueryHandlers } from "@cocrepo/usecase";
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
		SpaceContext,
		...AssetQueryHandlers,
	],
})
export class AssetsModule {}
