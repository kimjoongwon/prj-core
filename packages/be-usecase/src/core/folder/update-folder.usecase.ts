import { FolderAggregate } from "@cocrepo/aggregate";
import { UpdateFolderCommand } from "@cocrepo/command";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(UpdateFolderCommand)
export class UpdateFolderUseCase {
	constructor(private readonly folderService: FolderAggregate) {}

	execute(command: UpdateFolderCommand): Promise<unknown> {
		return this.folderService.updateFolder(command.folderId, command.input);
	}
}
