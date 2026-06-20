import { FolderAggregate } from "@cocrepo/aggregate";
import { DeleteFolderCommand } from "@cocrepo/command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(DeleteFolderCommand)
export class DeleteFolderUseCase
	implements ICommandHandler<DeleteFolderCommand>
{
	constructor(private readonly folderService: FolderAggregate) {}

	async execute(command: DeleteFolderCommand): Promise<void> {
		await this.folderService.deleteFolder(command.folderId);
	}
}
