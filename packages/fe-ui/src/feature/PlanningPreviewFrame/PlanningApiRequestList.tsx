import type { PlanningApiRequest } from "@cocrepo/type";

export interface PlanningApiRequestListProps {
	requests?: readonly PlanningApiRequest[];
}

export function PlanningApiRequestList({ requests }: PlanningApiRequestListProps) {
	return (
		<>
			{requests?.map((request) => (
				<div
					className="rounded-md border border-border bg-background px-3 py-2 text-sm"
					key={`${request.method}:${request.path}:${request.status}`}
				>
					<p className="font-semibold">
						{request.method} {request.path}
					</p>
					<p className="text-xs text-muted">status {request.status}</p>
					{request.description ? (
						<p className="mt-1 text-xs text-muted">{request.description}</p>
					) : null}
				</div>
			))}
		</>
	);
}
