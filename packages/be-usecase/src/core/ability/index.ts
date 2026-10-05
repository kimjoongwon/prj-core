import { CreateAbilityUseCase } from "./create-ability.usecase";
import { DeleteAbilityUseCase } from "./delete-ability.usecase";
import { GetAbilityByIdUseCase } from "./get-ability-by-id.usecase";
import { GetAllAbilitiesUseCase } from "./get-all-abilities.usecase";
import { GetMyAbilitiesUseCase } from "./get-my-abilities.usecase";
import { UpdateAbilityUseCase } from "./update-ability.usecase";

export const AbilityQueryHandlers = [
	GetAllAbilitiesUseCase,
	GetMyAbilitiesUseCase,
	GetAbilityByIdUseCase,
];

export const AbilityCommandHandlers = [
	CreateAbilityUseCase,
	UpdateAbilityUseCase,
	DeleteAbilityUseCase,
];

export * from "./create-ability.usecase";
export * from "./delete-ability.usecase";
export * from "./get-ability-by-id.usecase";
export * from "./get-all-abilities.usecase";
export * from "./get-my-abilities.usecase";
export * from "./update-ability.usecase";
