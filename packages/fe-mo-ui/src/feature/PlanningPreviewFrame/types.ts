import type { PlanningScenario } from "@cocrepo/type";
import type { PropsWithChildren } from "react";

export interface PlanningPreviewFrameProps<THandler = unknown>
	extends PropsWithChildren {
	scenario: PlanningScenario<THandler>;
}
