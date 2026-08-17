import type { PlanningScenario, PlanningSpaceOption } from "@cocrepo/type";
import type { PropsWithChildren } from "react";

export interface PlanningPreviewFrameProps
	extends PropsWithChildren {
	scenario: PlanningScenario;
	onSpaceChange?: (space: PlanningSpaceOption) => void;
}
