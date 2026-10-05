"use client";

import { ArrowLeft, Check, X } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Chip } from "../../data-display/Chip/Chip";
import { Typography } from "../../data-display/Typography";
import { Skeleton } from "../../feedback/Skeleton/Skeleton";
import { Button } from "../../input/Button/Button";
import { TextArea } from "../../input/TextArea/TextArea";
import { Section } from "../../layout";
import { Screen } from "../../layout/Screen";
import { HStack } from "../../rhythm/HStack/HStack";
import { VStack } from "../../rhythm/VStack/VStack";
import { SectionSurface } from "../../surface";

type TenantAccessRequestStatus =
	| "PENDING"
	| "APPROVED"
	| "REJECTED"
	| "CANCELED";
const STATUS_LABELS: Record<TenantAccessRequestStatus, string> = {
	PENDING: "대기",
	APPROVED: "승인",
	REJECTED: "반려",
	CANCELED: "취소",
};
const STATUS_COLORS: Record<
	TenantAccessRequestStatus,
	"warning" | "success" | "danger" | "default"
> = {
	PENDING: "warning",
	APPROVED: "success",
	REJECTED: "danger",
	CANCELED: "default",
};
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
export interface TenantAccessRequestReviewDetailScreenProps {
	request?: TenantAccessRequestReviewDetail;
	reviewComment: string;
	isLoading: boolean;
	isApproving: boolean;
	isRejecting: boolean;
	canApprove: boolean;
	onClickBackButton: () => void;
	onChangeReviewCommentTextArea: (reviewComment: string) => void;
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
		<VStack>
			<Typography
				type="body-xs"
				weight="medium"
				className="uppercase"
				color="muted"
			>
				{label}
			</Typography>
			<Typography type="body-sm">
				{value || "-"}
			</Typography>
		</VStack>
	);
}
function TenantAccessRequestStatusChip({
	status,
}: {
	status: TenantAccessRequestStatus;
}) {
	return (
		<Chip color={STATUS_COLORS[status]} size="sm" variant="soft">
			{STATUS_LABELS[status]}
		</Chip>
	);
}
function RequestSummaryBlock({
	spaceName,
	roleName,
	requesterName,
	requesterEmail,
}: {
	spaceName: string;
	roleName: string;
	requesterName?: string;
	requesterEmail?: string;
}) {
	return (
		<VStack gap="dense">
			<HStack alignItems="center" className="flex-wrap">
				<Typography weight="medium">
					{spaceName}
				</Typography>
				<Chip size="sm" variant="soft">
					{roleName}
				</Chip>
			</HStack>
			<Typography type="body-sm" color="muted">
				{requesterName || requesterEmail
					? `${requesterName ?? requesterEmail}${requesterName && requesterEmail ? ` · ${requesterEmail}` : ""}`
					: "-"}
			</Typography>
		</VStack>
	);
}
export const TenantAccessRequestReviewDetailScreen = observer(
	({
		request,
		reviewComment,
		isLoading,
		isApproving,
		isRejecting,
		canApprove,
		onClickBackButton,
		onChangeReviewCommentTextArea,
		onClickApproveButton,
		onClickRejectButton,
	}: TenantAccessRequestReviewDetailScreenProps) => (
		<VStack>
			<Screen.Header
				title="접근 신청 상세"
				description="신청 내용을 확인하고 승인 또는 반려합니다."
				actions={
					<Button
						variant="tertiary"
						startContent={<ArrowLeft className="size-4" />}
						onPress={onClickBackButton}
					>
						목록
					</Button>
				}
			/>
			<SectionSurface>
				<Section>
					<Section.Body>
						{isLoading || !request ? (
							<Skeleton className="h-96 rounded-lg" />
						) : (
							<VStack>
								<Section>
									<Section.Body>
										<VStack>
											<HStack
												justifyContent="between"
												alignItems="start"
												fullWidth
												className="flex-wrap"
											>
												<RequestSummaryBlock
													spaceName={request.spaceName}
													roleName={request.roleName}
													requesterName={request.requesterName}
													requesterEmail={request.requesterEmail}
												/>
												<TenantAccessRequestStatusChip
													status={request.status}
												/>
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
									</Section.Body>
								</Section>
								<Section>
									<Section.Body>
										<VStack>
											<Section.Header title="검토" />
											<TextArea
												label="검토 코멘트"
												labelPlacement="outside"
												placeholder="승인 또는 반려 사유를 입력하세요."
												value={reviewComment}
												onValueChange={onChangeReviewCommentTextArea}
												maxLength={1000}
												isDisabled={request.status !== "PENDING"}
												description={`${reviewComment.length} / 1000`}
											/>
											{request.status !== "PENDING" ? (
												<div className="rounded-lg border border-border bg-surface-secondary p-4">
													<DetailItem
														label="처리자"
														value={request.reviewerName}
													/>
													<div className="mt-3">
														<DetailItem
															label="처리 코멘트"
															value={request.reviewComment}
														/>
													</div>
												</div>
											) : null}
											<HStack justifyContent="end" fullWidth>
												<Button variant="tertiary" onPress={onClickBackButton}>
													닫기
												</Button>
												<Button
													variant="tertiary"
													startContent={<X className="size-4" />}
													isLoading={isRejecting}
													isDisabled={
														request.status !== "PENDING" || isApproving
													}
													onPress={onClickRejectButton}
												>
													반려
												</Button>
												<Button
													variant="primary"
													startContent={<Check className="size-4" />}
													isLoading={isApproving}
													isDisabled={
														request.status !== "PENDING" ||
														!canApprove ||
														isRejecting
													}
													onPress={onClickApproveButton}
												>
													승인
												</Button>
											</HStack>
										</VStack>
									</Section.Body>
								</Section>
							</VStack>
						)}
					</Section.Body>
				</Section>
			</SectionSurface>
		</VStack>
	),
);
