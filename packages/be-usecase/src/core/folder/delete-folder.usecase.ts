import { FolderAggregate } from "@cocrepo/aggregate";
import { DeleteFolderCommand } from "@cocrepo/command";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(DeleteFolderCommand)
export class DeleteFolderUseCase {
	constructor(private readonly folderService: FolderAggregate) {}

	async execute(command: DeleteFolderCommand): Promise<void> {
		await this.folderService.deleteFolder(command.folderId);
	}
}
