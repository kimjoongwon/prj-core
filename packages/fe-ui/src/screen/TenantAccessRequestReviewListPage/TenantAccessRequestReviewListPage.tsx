"use client";

import type { TenantAccessRequestDto } from "@cocrepo/api/core/tenant-access-requests";
import { Eye } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Button } from "../../action/Button/Button";
import { Chip } from "../../data-display/Chip/Chip";
import { Skeleton } from "../../feedback/Skeleton/Skeleton";
import { Table } from "@heroui/react";
import { useT } from "../../i18n";
import { HStack } from "../../rhythm/HStack/HStack";
import { VStack } from "../../rhythm/VStack/VStack";
import { PageSurface } from "../../surface/PageSurface";
import { SectionSurface } from "../../surface/SectionSurface";
import { PageTitleBar } from "../../widget/PageTitleBar";
import {
	TenantAccessRequestStatusBadge,
	TenantAccessRequestSummary,
} from "../../widget/tenant-access-request";

export interface TenantAccessRequestReviewListPageProps {
	requests?: TenantAccessRequestDto[];
	totalCount: number;
	pendingCount: number;
	isLoading: boolean;
	onClickRequestRow: (tenantAccessRequestId: string) => void;
}

function formatDateTime(value: string) {
	return new Date(value).toLocaleString("ko-KR", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	});
}

function getSpaceName(request: TenantAccessRequestDto) {
	return request.space?.ground?.name ?? request.spaceId;
}

function getRoleName(request: TenantAccessRequestDto) {
	return (
		request.requestedRole?.displayName ??
		request.requestedRole?.name ??
		request.requestedRoleId
	);
}

export const TenantAccessRequestReviewListPage = observer(
	({
		requests,
		totalCount,
		pendingCount,
		isLoading,
		onClickRequestRow,
	}: TenantAccessRequestReviewListPageProps) => {
		const t = useT();
		const requestRows = requests ?? [];

		return (
			<VStack gap={5}>
				<PageTitleBar
					title="접근 승인"
					description="Space/Role 접근 신청을 검토하고 승인 또는 반려합니다."
				/>
				<PageSurface>
					<VStack gap={4}>
						<div className="grid gap-3 md:grid-cols-2">
							<SectionSurface>
								<VStack gap={1}>
									<span className="text-sm text-muted">전체 신청</span>
									<span className="text-2xl font-semibold text-foreground">
										{totalCount.toLocaleString("ko-KR")}
									</span>
								</VStack>
							</SectionSurface>
							<SectionSurface>
								<VStack gap={1}>
									<span className="text-sm text-muted">승인 대기</span>
									<HStack gap={2} alignItems="center">
										<span className="text-2xl font-semibold text-foreground">
											{pendingCount.toLocaleString("ko-KR")}
										</span>
										<Chip color="warning" variant="flat" size="sm">
											PENDING
										</Chip>
									</HStack>
								</VStack>
							</SectionSurface>
						</div>
						<SectionSurface>
							<VStack gap={4}>
								<PageTitleBar level={2} title="검토 목록" />
								{isLoading ? (
									<Skeleton className="h-56 rounded-lg" />
								) : (
									<Table
										aria-label={t("테넌트 접근 신청 검토 목록")}
									>
										<Table.Content>
					<Table.Header>
											<Table.Column>{t("신청")}</Table.Column>
											<Table.Column>{t("상태")}</Table.Column>
											<Table.Column>{t("신청일")}</Table.Column>
											<Table.Column className="text-right">{t("상세")}</Table.Column>
										</Table.Header>
										<Table.Body>
											{requestRows.map((request) => (
												<Table.Row key={request.id}>
													<Table.Cell>
														<TenantAccessRequestSummary
															spaceName={getSpaceName(request)}
															roleName={getRoleName(request)}
															requesterName={request.requester?.name}
															requesterEmail={request.requester?.email}
														/>
													</Table.Cell>
													<Table.Cell>
														<TenantAccessRequestStatusBadge
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
																variant="flat"
																startContent={<Eye className="size-4" />}
																onPress={() => onClickRequestRow(request.id)}
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
						</SectionSurface>
					</VStack>
				</PageSurface>
			</VStack>
		);
	},
);
