import { CreatePolicyUseCase } from "./create-policy.usecase";
import { DeletePolicyUseCase } from "./delete-policy.usecase";
import { GetPolicyByIdUseCase } from "./get-policy-by-id.usecase";
import { ListPoliciesUseCase } from "./list-policies.usecase";
import { SyncPolicyAbilitiesUseCase } from "./sync-policy-abilities.usecase";
import { UpdatePolicyUseCase } from "./update-policy.usecase";

export const PolicyQueryHandlers = [ListPoliciesUseCase, GetPolicyByIdUseCase];

export const PolicyCommandHandlers = [
	CreatePolicyUseCase,
	UpdatePolicyUseCase,
	DeletePolicyUseCase,
	SyncPolicyAbilitiesUseCase,
];

export * from "./create-policy.usecase";
export * from "./delete-policy.usecase";
export * from "./get-policy-by-id.usecase";
export * from "./list-policies.usecase";
export * from "./sync-policy-abilities.usecase";
export * from "./update-policy.usecase";
