import { CreateSpaceUseCase } from "./create-space.usecase";
import { GetSpaceGroundUseCase } from "./get-space-ground.usecase";
import { ListSpacesUseCase } from "./list-spaces.usecase";
import { UpdateSpaceGroundUseCase } from "./update-space-ground.usecase";

export const SpaceQueryHandlers = [ListSpacesUseCase, GetSpaceGroundUseCase];

export const SpaceCommandHandlers = [
	CreateSpaceUseCase,
	UpdateSpaceGroundUseCase,
];

export * from "./create-space.usecase";
export * from "./get-space-ground.usecase";
export * from "./list-spaces.usecase";
export * from "./update-space-ground.usecase";
