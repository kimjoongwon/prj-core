import type { PlanningScenario } from "@cocrepo/type";
import type { ReactNode } from "react";
import { PlanningPreviewFrame } from "./PlanningPreviewFrame";
import { createPlanningParameters } from "./planningMsw";

export interface CreatePlanningStoryOptions<TArgs, THandler = unknown> {
	scenario: PlanningScenario<THandler>;
	args?: Partial<TArgs>;
	parameters?: Record<string, unknown>;
	render: (args: TArgs) => ReactNode;
}

export function createPlanningStory<TArgs extends object, THandler = unknown>({
	args,
	parameters,
	render,
	scenario,
}: CreatePlanningStoryOptions<TArgs, THandler>) {
	return {
		args,
		parameters: createPlanningParameters(scenario, parameters),
		render: (storyArgs: TArgs) => (
			<PlanningPreviewFrame scenario={scenario}>
				{render(storyArgs)}
			</PlanningPreviewFrame>
		),
	};
}
