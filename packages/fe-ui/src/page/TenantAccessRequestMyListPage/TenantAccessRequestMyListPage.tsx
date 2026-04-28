"use client";

import type { TenantAccessRequestDto } from "@cocrepo/api/core/tenant-access-requests";
import {
	Button,
	Skeleton,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from "@heroui/react";
import { Plus, X } from "lucide-react";
import { observer } from "mobx-react-lite";
import { HStack } from "../../rhythm/HStack/HStack";
import { VStack } from "../../rhythm/VStack/VStack";
import { PageSurface } from "../../surface/PageSurface";
import { SectionSurface } from "../../surface/SectionSurface";
import { PageTitleBar } from "../../widget/PageTitleBar";
import {
	TenantAccessRequestStatusBadge,
	TenantAccessRequestSummary,
} from "../../widget/tenant-access-request";

export interface TenantAccessRequestMyListPageProps {
	requests?: TenantAccessRequestDto[];
	totalCount: number;
	isLoading: boolean;
	cancelingRequestId?: string | null;
	onClickNewRequestButton: () => void;
	onClickCancelRequestButton: (tenantAccessRequestId: string) => void;
}

function formatDate(value: string) {
	return new Date(value).toLocaleDateString("ko-KR", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
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

export const TenantAccessRequestMyListPage = observer(
	({
		requests,
		totalCount,
		isLoading,
		cancelingRequestId,
		onClickNewRequestButton,
		onClickCancelRequestButton,
	}: TenantAccessRequestMyListPageProps) => {
		const requestRows = requests ?? [];

		return (
			<VStack gap={5}>
				<PageTitleBar
					title="접근 신청"
					description="필요한 Space와 역할을 신청하고 처리 상태를 확인합니다."
					actions={
						<Button
							color="primary"
							startContent={<Plus className="size-4" />}
							onPress={onClickNewRequestButton}
						>
							신청하기
						</Button>
					}
				/>
				<PageSurface>
					<SectionSurface>
						<VStack gap={4}>
							<HStack justifyContent="between" alignItems="center" fullWidth>
								<PageTitleBar
									level={2}
									title="내 신청 목록"
									description={`총 ${totalCount.toLocaleString("ko-KR")}건`}
								/>
							</HStack>
							{isLoading ? (
								<Skeleton className="h-48 rounded-lg" />
							) : (
								<Table aria-label="내 테넌트 접근 신청 목록" removeWrapper>
									<TableHeader>
										<TableColumn>신청</TableColumn>
										<TableColumn>상태</TableColumn>
										<TableColumn>사유</TableColumn>
										<TableColumn>신청일</TableColumn>
										<TableColumn align="end">작업</TableColumn>
									</TableHeader>
									<TableBody emptyContent="신청 내역이 없습니다.">
										{requestRows.map((request) => (
											<TableRow key={request.id}>
												<TableCell>
													<TenantAccessRequestSummary
														spaceName={getSpaceName(request)}
														roleName={getRoleName(request)}
													/>
												</TableCell>
												<TableCell>
													<TenantAccessRequestStatusBadge
														status={request.status}
													/>
												</TableCell>
												<TableCell>
													<span className="line-clamp-2 max-w-[280px] text-sm text-default-600">
														{request.reason || "-"}
													</span>
												</TableCell>
												<TableCell>{formatDate(request.createdAt)}</TableCell>
												<TableCell>
													<div className="flex justify-end">
														<Button
															size="sm"
															variant="flat"
															color="danger"
															startContent={<X className="size-4" />}
															isDisabled={request.status !== "PENDING"}
															isLoading={cancelingRequestId === request.id}
															onPress={() =>
																onClickCancelRequestButton(request.id)
															}
														>
															취소
														</Button>
													</div>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							)}
						</VStack>
					</SectionSurface>
				</PageSurface>
			</VStack>
		);
	},
);
