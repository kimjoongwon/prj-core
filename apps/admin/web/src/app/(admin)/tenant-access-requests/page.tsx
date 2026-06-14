"use client";

import { useGetTenantAccessRequests } from "@cocrepo/api/core/tenant-access-requests";
import { ADMIN_PATHS } from "@cocrepo/constant";
import { TenantAccessRequestReviewListScreen } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

export default observer(function TenantAccessRequestsReviewPageRoute() {
	const router = useRouter();
	const { data: response, isLoading } = useGetTenantAccessRequests({
		take: 20,
		skip: 0,
	});
	const { data: pendingResponse, isLoading: isLoadingPending } =
		useGetTenantAccessRequests({
			take: 1,
			skip: 0,
			status: "PENDING",
		});

	return (
		<>
			<TenantAccessRequestReviewListScreen
				requests={response?.data}
				totalCount={response?.meta?.total ?? 0}
				pendingCount={pendingResponse?.meta?.total ?? 0}
				isLoading={isLoading || isLoadingPending}
				onClickRequestRow={(tenantAccessRequestId) => {
					router.push(
						ADMIN_PATHS.TENANT_ACCESS_REQUESTS_DETAIL.replace(
							"[tenantAccessRequestId]",
							tenantAccessRequestId,
						) as Route,
					);
				}}
			/>
		</>
	);
});
