"use client";

import { ArrowLeft, Check, X } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Skeleton } from "../../feedback/Skeleton/Skeleton";
import { Button } from "../../input/Button/Button";
import { TextArea } from "../../input/TextArea/TextArea";
import { Section } from "../../layout";
import { HStack } from "../../rhythm/HStack/HStack";
import { VStack } from "../../rhythm/VStack/VStack";
import { SectionSurface } from "../../surface";
import {
	type TenantAccessRequestStatus,
	TenantAccessRequestStatusBadge,
	TenantAccessRequestSummary,
} from "../../widget";
import { PageTitleBar } from "../../widget/PageTitleBar";
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
			<span className="text-xs font-medium uppercase text-muted">{label}</span>
			<span className="text-sm text-foreground">{value || "-"}</span>
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
												<TenantAccessRequestSummary
													spaceName={request.spaceName}
													roleName={request.roleName}
													requesterName={request.requesterName}
													requesterEmail={request.requesterEmail}
												/>
												<TenantAccessRequestStatusBadge
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
											<PageTitleBar level={2} title="검토" />
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
												<div className="rounded-lg border border-border bg-surface-secondary/40 p-4">
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
												<Button variant="flat" onPress={onClickBackButton}>
													닫기
												</Button>
												<Button
													color="danger"
													variant="flat"
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
													color="primary"
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
