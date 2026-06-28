import type { PlanningScenario } from "@cocrepo/type";

export function getPlanningMswHandlers<THandler>(
	scenario: PlanningScenario<THandler>,
): THandler[] {
	if (scenario.api?.mode !== "msw" || !scenario.api.handlers) {
		return [];
	}

	return [...scenario.api.handlers];
}

export function createPlanningParameters<THandler>(
	scenario: PlanningScenario<THandler>,
	parameters: Record<string, unknown> = {},
) {
	return {
		...parameters,
		planning: scenario,
		msw: {
			handlers: getPlanningMswHandlers(scenario),
		},
	};
}
