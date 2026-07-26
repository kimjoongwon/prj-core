import { CreateSpaceUseCase } from "./create-space.usecase";
import { GetSpaceFitnessCenterUseCase } from "./get-space-fitness-center.usecase";
import { ListSpacesUseCase } from "./list-spaces.usecase";
import { UpdateSpaceFitnessCenterUseCase } from "./update-space-fitness-center.usecase";

export const SpaceQueryHandlers = [
	ListSpacesUseCase,
	GetSpaceFitnessCenterUseCase,
];

export const SpaceCommandHandlers = [
	CreateSpaceUseCase,
	UpdateSpaceFitnessCenterUseCase,
];

export * from "./create-space.usecase";
export * from "./get-space-fitness-center.usecase";
export * from "./list-spaces.usecase";
export * from "./update-space-fitness-center.usecase";
