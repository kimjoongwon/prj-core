import { FolderAggregate } from "@cocrepo/aggregate";
import { CreateFolderCommand } from "@cocrepo/command";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(CreateFolderCommand)
export class CreateFolderUseCase {
	constructor(private readonly folderService: FolderAggregate) {}

	execute(command: CreateFolderCommand): Promise<unknown> {
		return this.folderService.createFolder(command, command.createdById);
	}
}
