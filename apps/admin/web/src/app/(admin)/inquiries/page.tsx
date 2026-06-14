"use client";

import {
	type InquiryStatus,
	useGetCreateInquiryForm,
	useGetInquiries,
	useGetInquiryStats,
} from "@cocrepo/api/core/inquiries";
import { ADMIN_PATHS } from "@cocrepo/constant";
import { InquiryListScreen } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

const mapSelectOptions = (items?: Array<{ value: unknown; label: string }>) =>
	(items ?? []).map((item) => ({
		value: String(item.value ?? ""),
		label: item.label,
	}));

export default observer(function InquiriesPageRoute() {
	const router = useRouter();
	const [queryStates, setQueryStates] = useQueryStates({
		take: parseAsInteger.withDefault(20),
		skip: parseAsInteger.withDefault(0),
		search: parseAsString.withDefault(""),
		inquiryStatus: parseAsString.withDefault(""),
	});
	const { data: filterBootstrapResponse, isLoading: isLoadingFilterBootstrap } =
		useGetCreateInquiryForm();
	const statusOptions = mapSelectOptions(
		filterBootstrapResponse?.data?.options.status,
	);
	const inquiryParams = {
		take: getNumberQueryValue(queryStates.take, 20),
		skip: getNumberQueryValue(queryStates.skip, 0),
		search: getSearchQueryValue(queryStates.search),
		inquiryStatus: getInquiryStatusFilter(
			queryStates.inquiryStatus,
			statusOptions,
		),
	};
	const { data: inquiriesResponse, isLoading: isLoadingInquiries } =
		useGetInquiries(inquiryParams);
	const { data: statsResponse, isLoading: isLoadingStats } =
		useGetInquiryStats();
	const activeStatus =
		typeof queryStates.inquiryStatus === "string"
			? queryStates.inquiryStatus
			: undefined;

	return (
		<>
			<InquiryListScreen
				inquiries={inquiriesResponse?.data}
				totalCount={inquiriesResponse?.meta?.total ?? 0}
				stats={{
					total: statsResponse?.data?.total ?? 0,
					newCount: statsResponse?.data?.new ?? 0,
					inProgress: statsResponse?.data?.inProgress ?? 0,
					resolved: statsResponse?.data?.resolved ?? 0,
					slaBreached: statsResponse?.data?.slaBreached ?? 0,
				}}
				statusOptions={statusOptions}
				activeStatus={activeStatus}
				isLoading={
					isLoadingInquiries || isLoadingStats || isLoadingFilterBootstrap
				}
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
						statusOptions.some((option) => option.value === status)
							? status
							: null;
					void setQueryStates({
						inquiryStatus,
						skip: 0,
					});
				}}
			/>
		</>
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

function getInquiryStatusFilter(
	value: unknown,
	statusOptions: Array<{ value: string }>,
): InquiryStatus | undefined {
	if (typeof value !== "string") {
		return undefined;
	}

	return statusOptions.some((option) => option.value === value)
		? (value as InquiryStatus)
		: undefined;
}
