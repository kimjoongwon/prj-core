"use client";

import { Button, Skeleton, Textarea } from "@cocrepo/ui/heroui";
import { ArrowLeft, Check, X } from "lucide-react";
import { observer } from "mobx-react-lite";
import { PageSurface } from "../../surface/PageSurface";
import { SectionSurface } from "../../surface/SectionSurface";
import { HStack } from "../../rhythm/HStack/HStack";
import { VStack } from "../../rhythm/VStack/VStack";
import { PageTitleBar } from "../../widget/PageTitleBar";
import {
	TenantAccessRequestStatusBadge,
	TenantAccessRequestSummary,
	type TenantAccessRequestStatus,
} from "../../widget/tenant-access-request";

export interface TenantAccessRequestReviewDetail {
	id: string;
	status: TenantAccessRequestStatus;
	spaceName: string;
	roleName: string;
	previousRoleName?: string | null;
	requesterName: string;
	requesterEmail: string;
	reason?: string | null;
	reviewerName?: string | null;
	reviewComment?: string | null;
	createdAt: string;
	reviewedAt?: string | null;
}

export interface TenantAccessRequestReviewDetailPageProps {
	request?: TenantAccessRequestReviewDetail;
	reviewComment: string;
	isLoading: boolean;
	isApproving: boolean;
	isRejecting: boolean;
	canApprove: boolean;
	onClickBackButton: () => void;
	onChangeReviewCommentTextarea: (reviewComment: string) => void;
	onClickApproveButton: () => void;
	onClickRejectButton: () => void;
}

function formatDateTime(value?: string | null) {
	if (!value) return "-";
	return new Date(value).toLocaleString("ko-KR", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	});
}

function DetailItem({
	label,
	value,
}: {
	label: string;
	value?: string | null;
}) {
	return (
		<VStack gap={1}>
			<span className="text-xs font-medium uppercase text-default-400">
				{label}
			</span>
			<span className="text-sm text-default-800">{value || "-"}</span>
		</VStack>
	);
}

export const TenantAccessRequestReviewDetailPage = observer(
	({
		request,
		reviewComment,
		isLoading,
		isApproving,
		isRejecting,
		canApprove,
		onClickBackButton,
		onChangeReviewCommentTextarea,
		onClickApproveButton,
		onClickRejectButton,
	}: TenantAccessRequestReviewDetailPageProps) => (
		<VStack gap={5}>
			<PageTitleBar
				title="접근 신청 상세"
				description="신청 내용을 확인하고 승인 또는 반려합니다."
				actions={
					<Button
						variant="flat"
						startContent={<ArrowLeft className="size-4" />}
						onPress={onClickBackButton}
					>
						목록
					</Button>
				}
			/>
			<PageSurface>
				{isLoading || !request ? (
					<Skeleton className="h-96 rounded-lg" />
				) : (
					<VStack gap={4}>
						<SectionSurface>
							<VStack gap={4}>
								<HStack
									justifyContent="between"
									alignItems="start"
									fullWidth
									className="flex-wrap"
								>
									<TenantAccessRequestSummary
										spaceName={request.spaceName}
										roleName={request.roleName}
										requesterName={request.requesterName}
										requesterEmail={request.requesterEmail}
									/>
									<TenantAccessRequestStatusBadge status={request.status} />
								</HStack>
								<div className="grid gap-4 md:grid-cols-3">
									<DetailItem
										label="기존 역할"
										value={request.previousRoleName}
									/>
									<DetailItem
										label="신청일"
										value={formatDateTime(request.createdAt)}
									/>
									<DetailItem
										label="처리일"
										value={formatDateTime(request.reviewedAt)}
									/>
								</div>
								<DetailItem label="신청 사유" value={request.reason} />
							</VStack>
						</SectionSurface>
						<SectionSurface>
							<VStack gap={4}>
								<PageTitleBar level={2} title="검토" />
								<Textarea
									label="검토 코멘트"
									labelPlacement="outside"
									placeholder="승인 또는 반려 사유를 입력하세요."
									value={reviewComment}
									onValueChange={onChangeReviewCommentTextarea}
									maxLength={1000}
									isDisabled={request.status !== "PENDING"}
									description={`${reviewComment.length} / 1000`}
								/>
								{request.status !== "PENDING" ? (
									<div className="rounded-lg border border-divider bg-content2/40 p-4">
										<DetailItem label="처리자" value={request.reviewerName} />
										<div className="mt-3">
											<DetailItem
												label="처리 코멘트"
												value={request.reviewComment}
											/>
										</div>
									</div>
								) : null}
								<HStack justifyContent="end" fullWidth>
									<Button variant="flat" onPress={onClickBackButton}>
										닫기
									</Button>
									<Button
										color="danger"
										variant="flat"
										startContent={<X className="size-4" />}
										isLoading={isRejecting}
										isDisabled={request.status !== "PENDING" || isApproving}
										onPress={onClickRejectButton}
									>
										반려
									</Button>
									<Button
										color="primary"
										startContent={<Check className="size-4" />}
										isLoading={isApproving}
										isDisabled={
											request.status !== "PENDING" || !canApprove || isRejecting
										}
										onPress={onClickApproveButton}
									>
										승인
									</Button>
								</HStack>
							</VStack>
						</SectionSurface>
					</VStack>
				)}
			</PageSurface>
		</VStack>
	),
);
