"use client";

import type { TenantAccessRequestDto } from "@cocrepo/api/core/tenant-access-requests";
import { Table } from "@heroui/react";
import { Plus, X } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Button } from "../../action/Button/Button";
import { Skeleton } from "../../feedback/Skeleton/Skeleton";
import { HStack } from "../../rhythm/HStack/HStack";
import { VStack } from "../../rhythm/VStack/VStack";
import { SectionSurface } from "../../surface";
import { PageTitleBar } from "../../widget/PageTitleBar";
import {
	TenantAccessRequestStatusBadge,
	TenantAccessRequestSummary,
} from "../../widget/tenant-access-request";
export interface TenantAccessRequestMyListScreenProps {
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
export const TenantAccessRequestMyListScreen = observer(
	({
		requests,
		totalCount,
		isLoading,
		cancelingRequestId,
		onClickNewRequestButton,
		onClickCancelRequestButton,
	}: TenantAccessRequestMyListScreenProps) => {
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
							<Table aria-label="내 테넌트 접근 신청 목록">
								<Table.Content>
									<Table.Header>
										<Table.Column>신청</Table.Column>
										<Table.Column>상태</Table.Column>
										<Table.Column>사유</Table.Column>
										<Table.Column>신청일</Table.Column>
										<Table.Column className="text-right">작업</Table.Column>
									</Table.Header>
									<Table.Body>
										{requestRows.map((request) => (
											<Table.Row key={request.id}>
												<Table.Cell>
													<TenantAccessRequestSummary
														spaceName={getSpaceName(request)}
														roleName={getRoleName(request)}
													/>
												</Table.Cell>
												<Table.Cell>
													<TenantAccessRequestStatusBadge
														status={request.status}
													/>
												</Table.Cell>
												<Table.Cell>
													<span className="line-clamp-2 max-w-[280px] text-sm text-muted">
														{request.reason || "-"}
													</span>
												</Table.Cell>
												<Table.Cell>{formatDate(request.createdAt)}</Table.Cell>
												<Table.Cell>
													<div className="flex justify-end">
														<Button
															size="sm"
															variant="flat"
															color="danger"
															startContent={<X className="size-4" />}
															isDisabled={
																request.status !== "PENDING" ||
																cancelingRequestId === request.id
															}
															onPress={() =>
																onClickCancelRequestButton(request.id)
															}
														>
															취소
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
		);
	},
);
