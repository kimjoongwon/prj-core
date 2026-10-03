"use client";

import type { TenantAccessRequestDto } from "@cocrepo/api/core/tenant-access-requests";
import { Table } from "@heroui/react";
import { Eye } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Chip } from "../../data-display/Chip/Chip";
import { Typography } from "../../data-display/Typography";
import { Skeleton } from "../../feedback/Skeleton/Skeleton";
import { useT } from "../../i18n";
import { Button } from "../../input/Button/Button";
import { Section } from "../../layout";
import { Screen } from "../../layout/Screen";
import { HStack } from "../../rhythm/HStack/HStack";
import { VStack } from "../../rhythm/VStack/VStack";
import { SectionSurface } from "../../surface";
export interface TenantAccessRequestReviewListScreenProps {
	requests?: TenantAccessRequestDto[];
	totalCount: number;
	pendingCount: number;
	isLoading: boolean;
	onClickRequestRow: (tenantAccessRequestId: bigint) => void;
}
function formatDateTime(value: Date | null) {
	if (value === null || Number.isNaN(value.getTime())) {
		return "-";
	}

	return value.toLocaleString("ko-KR", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	});
}
function getSpaceName(request: TenantAccessRequestDto) {
	const space = request.space as
		| (TenantAccessRequestDto["space"] & {
				fitnessCenter?: {
					name?: string | null;
					company?: {
						name?: string | null;
					} | null;
				} | null;
		  })
		| undefined;
	return (
		space?.fitnessCenter?.name ??
		space?.fitnessCenter?.company?.name ??
		request.spaceId
	);
}
function getRoleName(request: TenantAccessRequestDto) {
	return (
		request.requestedRole?.displayName ??
		request.requestedRole?.name ??
		request.requestedRoleId
	);
}
type TenantAccessRequestStatus = TenantAccessRequestDto["status"];
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
function RequestSummaryCell({
	spaceName,
	roleName,
	requesterName,
	requesterEmail,
}: {
	spaceName: string | bigint;
	roleName: string | bigint;
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
			{requesterName || requesterEmail ? (
				<Typography type="body-sm" color="muted">
					{requesterName ?? requesterEmail}
					{requesterName && requesterEmail ? ` · ${requesterEmail}` : ""}
				</Typography>
			) : null}
		</VStack>
	);
}
export const TenantAccessRequestReviewListScreen = observer(
	({
		requests,
		totalCount,
		pendingCount,
		isLoading,
		onClickRequestRow,
	}: TenantAccessRequestReviewListScreenProps) => {
		const t = useT();
		const requestRows = requests ?? [];
		return (
			<VStack>
				<Screen.Header
					title="접근 승인"
					description="공간과 역할 접근 신청을 검토하고 승인 또는 반려합니다."
				/>
				<SectionSurface>
					<Section>
						<Section.Body>
							<VStack>
								<div className="grid gap-3 md:grid-cols-2">
									<Section>
										<Section.Body>
											<VStack>
												<Typography
													type="body-sm"
													color="muted"
												>
													전체 신청
												</Typography>
												<Typography.Heading level={3}>
													{totalCount.toLocaleString("ko-KR")}
												</Typography.Heading>
											</VStack>
										</Section.Body>
									</Section>
									<Section>
										<Section.Body>
											<VStack>
												<Typography
													type="body-sm"
													color="muted"
												>
													승인 대기
												</Typography>
												<HStack alignItems="center">
													<Typography.Heading level={3}>
														{pendingCount.toLocaleString("ko-KR")}
													</Typography.Heading>
													<Chip color="warning" variant="soft" size="sm">
														PENDING
													</Chip>
												</HStack>
											</VStack>
										</Section.Body>
									</Section>
								</div>
								<Section>
									<Section.Body>
										<VStack>
											<Section.Header title="검토 목록" />
											{isLoading ? (
												<Skeleton className="h-56 rounded-lg" />
											) : (
												<Table aria-label={t("테넌트 접근 신청 검토 목록")}>
													<Table.Content>
														<Table.Header>
															<Table.Column>{t("신청")}</Table.Column>
															<Table.Column>{t("상태")}</Table.Column>
															<Table.Column>{t("신청일")}</Table.Column>
															<Table.Column className="text-right">
																{t("상세")}
															</Table.Column>
														</Table.Header>
														<Table.Body>
															{requestRows.map((request) => (
																<Table.Row key={String(request.id)}>
																	<Table.Cell>
																		<RequestSummaryCell
																			spaceName={getSpaceName(request)}
																			roleName={getRoleName(request)}
																			requesterName={request.requester?.name}
																			requesterEmail={request.requester?.email}
																		/>
																	</Table.Cell>
																	<Table.Cell>
																		<TenantAccessRequestStatusChip
																			status={request.status}
																		/>
																	</Table.Cell>
																	<Table.Cell>
																		{formatDateTime(request.createdAt)}
																	</Table.Cell>
																	<Table.Cell>
																		<div className="flex justify-end">
																			<Button
																				size="sm"
																				variant="tertiary"
																				startContent={
																					<Eye className="size-4" />
																				}
																				onPress={() =>
																					onClickRequestRow(request.id)
																				}
																			>
																				{t("보기")}
																			</Button>
																		</div>
																	</Table.Cell>
																</Table.Row>
															))}
														</Table.Body>
													</Table.Content>
												</Table>
											)}
										</VStack>
									</Section.Body>
								</Section>
							</VStack>
						</Section.Body>
					</Section>
				</SectionSurface>
			</VStack>
		);
	},
);
