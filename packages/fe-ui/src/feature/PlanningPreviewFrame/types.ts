import type { PlanningScenario, PlanningSpaceOption } from "@cocrepo/type";
import type { PropsWithChildren } from "react";

export interface PlanningPreviewFrameProps<THandler = unknown>
	extends PropsWithChildren {
	scenario: PlanningScenario<THandler>;
	onSpaceChange?: (space: PlanningSpaceOption) => void;
}
