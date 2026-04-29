"use client";

import {
	getGetMyTenantAccessRequestsQueryKey,
	useCancelTenantAccessRequest,
	useGetMyTenantAccessRequests,
} from "@cocrepo/api/core/tenant-access-requests";
import { IDP_PATHS } from "@cocrepo/constant";
import { TenantAccessRequestMyListPage } from "@cocrepo/ui";
import { addToast } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

export default observer(function TenantAccessRequestsPageRoute() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const { data: response, isLoading } = useGetMyTenantAccessRequests({
		take: 20,
		skip: 0,
	});
	const {
		mutate: cancelRequest,
		isPending: isCanceling,
		variables: cancelVariables,
	} = useCancelTenantAccessRequest({
		mutation: {
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: getGetMyTenantAccessRequestsQueryKey(),
				});
				addToast({
					title: "신청을 취소했습니다.",
					color: "success",
				});
			},
			onError: () => {
				addToast({
					title: "신청 취소에 실패했습니다.",
					color: "danger",
				});
			},
		},
	});

	return (
		<TenantAccessRequestMyListPage
			requests={response?.data}
			totalCount={response?.meta?.total ?? 0}
			isLoading={isLoading}
			cancelingRequestId={
				isCanceling ? cancelVariables?.tenantAccessRequestId : null
			}
			onClickNewRequestButton={() => {
				router.push(IDP_PATHS.TENANT_ACCESS_REQUESTS_NEW as Route);
			}}
			onClickCancelRequestButton={(tenantAccessRequestId) => {
				cancelRequest({ tenantAccessRequestId });
			}}
		/>
	);
});
