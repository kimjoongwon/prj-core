import { AssetAggregate } from "@cocrepo/aggregate";
import { UploadAssetCommand } from "@cocrepo/command";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(UploadAssetCommand)
export class UploadAssetUseCase {
	constructor(private readonly assetService: AssetAggregate) {}

	execute(command: UploadAssetCommand): Promise<unknown> {
		return this.assetService.uploadAsset(
			command,
			command.file,
			command.creatorId,
		);
	}
}
