"use client";

import {
	type InquiryDto,
	type InquiryStatus,
	useGetInquiries,
	useGetInquiryStats,
} from "@cocrepo/api/core/inquiries";
import { ADMIN_PATHS } from "@cocrepo/constant";
import {
	InquiryListPage,
	type InquiryListPageInquiry,
	type SLAStatus,
} from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

const FILTERABLE_INQUIRY_STATUSES: InquiryStatus[] = [
	"NEW",
	"IN_PROGRESS",
	"WAITING_CUSTOMER",
	"RESOLVED",
	"CLOSED",
];

export default observer(function InquiriesPageRoute() {
	const router = useRouter();
	const [queryStates, setQueryStates] = useQueryStates({
		take: parseAsInteger.withDefault(20),
		skip: parseAsInteger.withDefault(0),
		search: parseAsString.withDefault(""),
		inquiryStatus: parseAsString.withDefault(""),
	});
	const { data: inquiriesResponse, isLoading: isLoadingInquiries } =
		useGetInquiries({
			take: getNumberQueryValue(queryStates.take, 20),
			skip: getNumberQueryValue(queryStates.skip, 0),
			search: getSearchQueryValue(queryStates.search),
			inquiryStatus: getInquiryStatusFilter(queryStates.inquiryStatus),
		});
	const { data: statsResponse, isLoading: isLoadingStats } =
		useGetInquiryStats();
	const activeStatus =
		typeof queryStates.inquiryStatus === "string"
			? queryStates.inquiryStatus
			: undefined;

	return (
		<InquiryListPage
			inquiries={(inquiriesResponse?.data ?? []).map(mapInquiryRow)}
			totalCount={inquiriesResponse?.meta?.total ?? 0}
			stats={{
				total: statsResponse?.data?.total ?? 0,
				newCount: statsResponse?.data?.new ?? 0,
				inProgress: statsResponse?.data?.inProgress ?? 0,
				resolved: statsResponse?.data?.resolved ?? 0,
				slaBreached: statsResponse?.data?.slaBreached ?? 0,
			}}
			activeStatus={activeStatus}
			isLoading={isLoadingInquiries || isLoadingStats}
			queryStates={queryStates}
			setQueryStates={setQueryStates}
			onClickNewInquiry={() => {
				router.push(ADMIN_PATHS.INQUIRIES_NEW as Route);
			}}
			onClickInquiryRow={(inquiryId) => {
				router.push(
					ADMIN_PATHS.INQUIRIES_DETAIL.replace(
						"[inquiryId]",
						inquiryId,
					) as Route,
				);
			}}
			onClickStatusFilter={(status) => {
				const inquiryStatus =
					typeof status === "string" &&
					FILTERABLE_INQUIRY_STATUSES.includes(status as InquiryStatus)
						? status
						: null;
				void setQueryStates({
					inquiryStatus,
					skip: 0,
				});
			}}
		/>
	);
});

function getNumberQueryValue(value: unknown, fallback: number): number {
	return typeof value === "number" ? value : fallback;
}

function getSearchQueryValue(value: unknown): string | undefined {
	if (typeof value !== "string") {
		return undefined;
	}

	const trimmed = value.trim();
	return trimmed.length > 0 ? trimmed : undefined;
}

function getInquiryStatusFilter(value: unknown): InquiryStatus | undefined {
	if (typeof value !== "string") {
		return undefined;
	}

	return FILTERABLE_INQUIRY_STATUSES.includes(value as InquiryStatus)
		? (value as InquiryStatus)
		: undefined;
}

function getSlaStatus(inquiry: InquiryDto): SLAStatus | undefined {
	if (inquiry.isSlaResponseBreached || inquiry.isSlaResolveBreached) {
		return "breach";
	}

	if (!inquiry.slaResponseDue) {
		return undefined;
	}

	const remainingMinutes = Math.floor(
		(new Date(inquiry.slaResponseDue).getTime() - Date.now()) / 60000,
	);

	if (remainingMinutes <= 60) {
		return "warning";
	}

	return "ok";
}

function getSlaRemainingMinutes(inquiry: InquiryDto): number | undefined {
	if (!inquiry.slaResponseDue) {
		return undefined;
	}

	return Math.floor(
		(new Date(inquiry.slaResponseDue).getTime() - Date.now()) / 60000,
	);
}

function mapInquiryRow(inquiry: InquiryDto): InquiryListPageInquiry {
	return {
		id: inquiry.id,
		title: inquiry.title,
		customerId: inquiry.customerId ?? "-",
		customerName: inquiry.customerId ?? "고객",
		status: inquiry.status,
		category: inquiry.category,
		channel: inquiry.channel,
		priority: inquiry.priority,
		assigneeId: inquiry.assigneeId,
		assigneeName: inquiry.assigneeId,
		sentiment: inquiry.sentiment ?? undefined,
		slaStatus: getSlaStatus(inquiry),
		slaRemainingMinutes: getSlaRemainingMinutes(inquiry),
		unreadCount: inquiry.unreadCount ?? 0,
		createdAt: inquiry.createdAt,
		updatedAt: inquiry.updatedAt,
	};
}
