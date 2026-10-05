import { GetDefaultSecurityPolicyUseCase } from "./get-default-security-policy.usecase";
import { UpdateSecurityPolicyUseCase } from "./update-security-policy.usecase";

export const SecurityPolicyQueryHandlers = [GetDefaultSecurityPolicyUseCase];

export const SecurityPolicyCommandHandlers = [UpdateSecurityPolicyUseCase];

export const SecurityPolicyUseCaseProviders = [
	...SecurityPolicyCommandHandlers,
	...SecurityPolicyQueryHandlers,
];

export * from "./get-default-security-policy.usecase";
export * from "./update-security-policy.usecase";
