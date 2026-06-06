"use client";

import { observer } from "mobx-react-lite";
import { Chip } from "../../../data-display/Chip/Chip";
import { HStack } from "../../../rhythm/HStack/HStack";
import { VStack } from "../../../rhythm/VStack/VStack";

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
		<VStack gap={1}>
			<HStack gap={2} alignItems="center" className="flex-wrap">
				<span className="font-medium text-foreground">{spaceName}</span>
				<Chip size="sm" variant="flat">
					{roleName}
				</Chip>
			</HStack>
			{requesterName || requesterEmail ? (
				<span className="text-sm text-muted">
					{requesterName ?? requesterEmail}
					{requesterName && requesterEmail ? ` · ${requesterEmail}` : ""}
				</span>
			) : null}
		</VStack>
	),
);
