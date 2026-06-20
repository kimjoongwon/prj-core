"use client";

import { observer } from "mobx-react-lite";
import { Chip, type ChipProps } from "../../data-display/Chip/Chip";

export type TenantAccessRequestStatus =
	| "PENDING"
	| "APPROVED"
	| "REJECTED"
	| "CANCELED";

export interface TenantAccessRequestStatusBadgeProps {
	status: TenantAccessRequestStatus;
}

const STATUS_LABELS: Record<TenantAccessRequestStatus, string> = {
	PENDING: "대기",
	APPROVED: "승인",
	REJECTED: "반려",
	CANCELED: "취소",
};

const STATUS_COLORS: Record<TenantAccessRequestStatus, ChipProps["color"]> = {
	PENDING: "warning",
	APPROVED: "success",
	REJECTED: "danger",
	CANCELED: "default",
};

export const TenantAccessRequestStatusBadge = observer(
	({ status }: TenantAccessRequestStatusBadgeProps) => (
		<Chip color={STATUS_COLORS[status]} size="sm" variant="flat">
			{STATUS_LABELS[status]}
		</Chip>
	),
);
