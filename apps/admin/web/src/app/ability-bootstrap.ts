import { type AbilityResponseDto } from "@cocrepo/api/core/abilities";
import { convertApiToAbilityRules } from "@cocrepo/store";
import type { AbilityApiResponse, AbilityRule } from "@cocrepo/type";

const GLOBAL_ACCESS_RULE: AbilityRule = {
	action: "manage",
	subject: "all",
};

interface ResolveAbilityBootstrapRulesInput {
	abilities: AbilityResponseDto[];
	hasFullAccess: boolean;
	isAbilityLoading: boolean;
	isAbilityError: boolean;
	isTokenVerificationPending: boolean;
}

function mapAbilityResponsesToRules(
	abilities: AbilityResponseDto[],
): AbilityRule[] {
	const apiResponses: AbilityApiResponse[] = abilities.map(
		(ability: AbilityResponseDto) => ({
			action: ability.action?.name,
			subject: ability.subject?.name,
			fields: ability.fields,
			conditions:
				(ability.conditions as Record<string, unknown> | null | undefined) ??
				undefined,
			inverted: ability.inverted,
			reason: ability.reason ?? undefined,
		}),
	);

	return convertApiToAbilityRules(apiResponses);
}

export function resolveAbilityBootstrapRules({
	abilities,
	hasFullAccess,
	isAbilityLoading,
	isAbilityError,
	isTokenVerificationPending,
}: ResolveAbilityBootstrapRulesInput): AbilityRule[] | null {
	if (hasFullAccess) {
		return [{ ...GLOBAL_ACCESS_RULE }];
	}

	if (isTokenVerificationPending || isAbilityLoading) {
		return null;
	}

	if (isAbilityError || abilities.length === 0) {
		return [];
	}

	return mapAbilityResponsesToRules(abilities);
}
