import type { PlanningScenario } from "@cocrepo/type";

export function formatPlanningStatus(status: PlanningScenario["status"]) {
	if (!status) {
		return "draft";
	}

	return status;
}
