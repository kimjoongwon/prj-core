import { CreateFolderUseCase } from "./create-folder.usecase";
import { DeleteFolderUseCase } from "./delete-folder.usecase";
import { GetFoldersUseCase } from "./get-folders.usecase";
import { UpdateFolderUseCase } from "./update-folder.usecase";

export const FolderQueryHandlers = [GetFoldersUseCase];

export const FolderCommandHandlers = [
	CreateFolderUseCase,
	UpdateFolderUseCase,
	DeleteFolderUseCase,
];

export * from "./create-folder.usecase";
export * from "./delete-folder.usecase";
export * from "./get-folders.usecase";
export * from "./update-folder.usecase";
