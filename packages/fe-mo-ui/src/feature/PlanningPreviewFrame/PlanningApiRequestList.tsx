import type { PlanningApiRequest } from "@cocrepo/type";
import { PlanningPreviewField } from "./PlanningPreviewField";

export interface PlanningApiRequestListProps {
	requests?: readonly PlanningApiRequest[];
}

export function PlanningApiRequestList({ requests }: PlanningApiRequestListProps) {
	return (
		<>
			{requests?.map((request) => (
				<PlanningPreviewField
					key={`${request.method}:${request.path}:${request.status}`}
					label={`${request.method} ${request.status}`}
					value={request.path}
				/>
			))}
		</>
	);
}
