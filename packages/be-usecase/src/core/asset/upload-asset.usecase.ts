import { AssetAggregateRoot } from "@cocrepo/aggregate";
import { UploadAssetCommand } from "@cocrepo/command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(UploadAssetCommand)
export class UploadAssetUseCase implements ICommandHandler<UploadAssetCommand> {
	constructor(private readonly assetService: AssetAggregateRoot) {}

	execute(command: UploadAssetCommand): Promise<unknown> {
		return this.assetService.uploadAsset(
			command.dto,
			command.file,
			command.creatorId,
		);
	}
}
