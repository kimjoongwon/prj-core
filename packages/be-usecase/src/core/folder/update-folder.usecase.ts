import { FolderAggregateRoot } from "@cocrepo/aggregate";
import { UpdateFolderCommand } from "@cocrepo/command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(UpdateFolderCommand)
export class UpdateFolderUseCase
	implements ICommandHandler<UpdateFolderCommand>
{
	constructor(private readonly folderService: FolderAggregateRoot) {}

	execute(command: UpdateFolderCommand): Promise<unknown> {
		return this.folderService.updateFolder(command.folderId, command.input);
	}
}
