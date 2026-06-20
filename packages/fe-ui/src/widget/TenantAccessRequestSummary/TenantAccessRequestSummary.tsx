"use client";

import { observer } from "mobx-react-lite";
import { Chip } from "../../data-display/Chip/Chip";

export interface TenantAccessRequestSummaryProps {
	spaceName: string;
	roleName: string;
	requesterName?: string;
	requesterEmail?: string;
}

export const TenantAccessRequestSummary = observer(
	({
		spaceName,
		roleName,
		requesterName,
		requesterEmail,
	}: TenantAccessRequestSummaryProps) => (
		<div className="flex flex-col gap-1">
			<div className="flex gap-2 items-center flex-wrap">
				<span className="font-medium text-foreground">{spaceName}</span>
				<Chip size="sm" variant="flat">
					{roleName}
				</Chip>
			</div>
			{requesterName || requesterEmail ? (
				<span className="text-sm text-muted">
					{requesterName ?? requesterEmail}
					{requesterName && requesterEmail ? ` · ${requesterEmail}` : ""}
				</span>
			) : null}
		</div>
	),
);
