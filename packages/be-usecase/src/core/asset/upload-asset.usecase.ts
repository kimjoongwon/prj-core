import { AssetAggregate } from "@cocrepo/aggregate";
import { UploadAssetCommand } from "@cocrepo/command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(UploadAssetCommand)
export class UploadAssetUseCase implements ICommandHandler<UploadAssetCommand> {
	constructor(private readonly assetService: AssetAggregate) {}

	execute(command: UploadAssetCommand): Promise<unknown> {
		return this.assetService.uploadAsset(
			command.input,
			command.file,
			command.creatorId,
		);
	}
}
