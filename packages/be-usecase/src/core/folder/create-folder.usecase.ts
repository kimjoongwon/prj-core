import { FolderAggregateRoot } from "@cocrepo/aggregate";
import { CreateFolderCommand } from "@cocrepo/command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(CreateFolderCommand)
export class CreateFolderUseCase
	implements ICommandHandler<CreateFolderCommand>
{
	constructor(private readonly folderService: FolderAggregateRoot) {}

	execute(command: CreateFolderCommand): Promise<unknown> {
		return this.folderService.createFolder(command.input, command.creatorId);
	}
}
