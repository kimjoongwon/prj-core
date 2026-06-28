import type { PlanningScenario } from "@cocrepo/type";

export function formatPlanningList(values?: readonly string[]) {
	return values && values.length > 0 ? values.join(", ") : "-";
}

export function formatPlanningStatus(status: PlanningScenario["status"]) {
	if (!status) {
		return "draft";
	}

	return status;
}
