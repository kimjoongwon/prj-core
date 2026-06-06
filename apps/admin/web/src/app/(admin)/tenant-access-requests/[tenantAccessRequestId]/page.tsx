"use client";

import {
	getGetTenantAccessRequestQueryKey,
	getGetTenantAccessRequestsQueryKey,
	type TenantAccessRequestDto,
	useApproveTenantAccessRequest,
	useGetTenantAccessRequest,
	useRejectTenantAccessRequest,
} from "@cocrepo/api/core/tenant-access-requests";
import { ADMIN_PATHS } from "@cocrepo/constant";
import {
	type TenantAccessRequestReviewDetail,
	TenantAccessRequestReviewDetailPage,
} from "@cocrepo/ui";
import { toast } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default observer(function TenantAccessRequestReviewDetailPageRoute() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const tenantAccessRequestId = useParams<{ tenantAccessRequestId: string }>()
		.tenantAccessRequestId;
	const reviewState = useLocalObservable(() => ({
		initializedRequestId: "",
		reviewComment: "",
		setFromRequest(request: TenantAccessRequestDto) {
			if (this.initializedRequestId === request.id) {
				return;
			}
			this.initializedRequestId = request.id;
			this.reviewComment = request.reviewComment ?? "";
		},
		setReviewComment(reviewComment: string) {
			this.reviewComment = reviewComment;
		},
	}));
	const { data: response, isLoading } = useGetTenantAccessRequest(
		tenantAccessRequestId,
	);
	const request = response?.data;
	const { mutate: approveRequest, isPending: isApproving } =
		useApproveTenantAccessRequest({
			mutation: {
				onSuccess: () => {
					invalidateTenantAccessRequestQueries(
						queryClient,
						tenantAccessRequestId,
					);
					toast.success("접근 신청을 승인했습니다.");
				},
				onError: () => {
					toast.danger("접근 신청 승인에 실패했습니다.");
				},
			},
		});
	const { mutate: rejectRequest, isPending: isRejecting } =
		useRejectTenantAccessRequest({
			mutation: {
				onSuccess: () => {
					invalidateTenantAccessRequestQueries(
						queryClient,
						tenantAccessRequestId,
					);
					toast.success("접근 신청을 반려했습니다.");
				},
				onError: () => {
					toast.danger("접근 신청 반려에 실패했습니다.");
				},
			},
		});

	useEffect(() => {
		if (request) {
			reviewState.setFromRequest(request);
		}
	}, [request, reviewState]);

	return (
		<TenantAccessRequestReviewDetailPage
			request={request ? mapReviewDetail(request) : undefined}
			reviewComment={reviewState.reviewComment}
			isLoading={isLoading}
			isApproving={isApproving}
			isRejecting={isRejecting}
			canApprove={true}
			onClickBackButton={() => {
				router.push(ADMIN_PATHS.TENANT_ACCESS_REQUESTS as Route);
			}}
			onChangeReviewCommentTextArea={(reviewComment) => {
				reviewState.setReviewComment(reviewComment);
			}}
			onClickApproveButton={() => {
				approveRequest({
					tenantAccessRequestId,
					data: { reviewComment: reviewState.reviewComment || null },
				});
			}}
			onClickRejectButton={() => {
				rejectRequest({
					tenantAccessRequestId,
					data: { reviewComment: reviewState.reviewComment || null },
				});
			}}
		/>
	);
});

function invalidateTenantAccessRequestQueries(
	queryClient: ReturnType<typeof useQueryClient>,
	tenantAccessRequestId: string,
) {
	queryClient.invalidateQueries({
		queryKey: getGetTenantAccessRequestQueryKey(tenantAccessRequestId),
	});
	queryClient.invalidateQueries({
		queryKey: getGetTenantAccessRequestsQueryKey(),
	});
}

function mapReviewDetail(
	request: TenantAccessRequestDto,
): TenantAccessRequestReviewDetail {
	return {
		id: request.id,
		status: request.status,
		spaceName: request.space?.ground?.name ?? request.spaceId,
		roleName:
			request.requestedRole?.displayName ??
			request.requestedRole?.name ??
			request.requestedRoleId,
		previousRoleName:
			request.previousRole?.displayName ?? request.previousRole?.name ?? null,
		requesterName: request.requester?.name ?? request.requesterId,
		requesterEmail: request.requester?.email ?? "",
		reason: request.reason,
		reviewerName: request.reviewer?.name ?? null,
		reviewComment: request.reviewComment,
		createdAt: request.createdAt,
		reviewedAt: request.reviewedAt,
	};
}
