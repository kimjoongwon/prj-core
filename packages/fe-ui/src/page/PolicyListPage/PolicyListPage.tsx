"use client";

import type { PolicyResponseDto } from "@cocrepo/api/core/policies";
import { PageTitleBar, Surface, VStack } from "@cocrepo/ui";
import {
	Button,
	Chip,
	Spinner,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from "@cocrepo/ui/heroui";
import { Edit, Eye, Plus, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";

export interface PolicyListPageProps {
	policies?: PolicyResponseDto[];
	totalCount: number;
	isLoading: boolean;
	onClickCreateButton: () => void;
	onClickPolicyRow: (policyId: string) => void;
	onClickEditPolicyButton: (policyId: string) => void;
	onClickDeletePolicyButton: (policyId: string) => void;
}

function getPolicyLabel(policy: PolicyResponseDto) {
	return policy.displayName || policy.name;
}

export const PolicyListPage = observer(
	({
		policies,
		totalCount,
		isLoading,
		onClickCreateButton,
		onClickPolicyRow,
		onClickEditPolicyButton,
		onClickDeletePolicyButton,
	}: PolicyListPageProps) => {
		const policyRows = policies ?? [];

		return (
			<div className="space-y-5">
				<PageTitleBar
					title="정책 목록"
					description="역할과 사용자에 할당할 정책 기반 인가 규칙을 관리합니다."
					actions={
						<Button
							color="primary"
							startContent={<Plus className="h-4 w-4" />}
							onPress={onClickCreateButton}
						>
							정책 추가
						</Button>
					}
				/>
				<VStack gap="section">
					<Surface className="overflow-hidden rounded-2xl border-divider/80 bg-content1/70">
						{isLoading ? (
							<div className="flex items-center justify-center gap-2 p-8">
								<Spinner size="sm" />
								<span className="text-default-500">정책을 불러오는 중...</span>
							</div>
						) : (
							<Table aria-label="정책 목록" removeWrapper>
								<TableHeader>
									<TableColumn>정책</TableColumn>
									<TableColumn>유형</TableColumn>
									<TableColumn>Ability</TableColumn>
									<TableColumn>생성일</TableColumn>
									<TableColumn>작업</TableColumn>
								</TableHeader>
								<TableBody emptyContent="등록된 정책이 없습니다.">
									{policyRows.map((policy) => (
										<TableRow key={policy.id}>
											<TableCell>
												<button
													className="text-left"
													type="button"
													onClick={() => onClickPolicyRow(policy.id)}
												>
													<p className="font-semibold">
														{getPolicyLabel(policy)}
													</p>
													<p className="text-xs text-default-500">
														{policy.description || policy.name}
													</p>
												</button>
											</TableCell>
											<TableCell>
												<Chip size="sm" variant="flat">
													{policy.isSystem ? "시스템" : "공간"}
												</Chip>
											</TableCell>
											<TableCell>
												{policy.policyAbilities?.length ?? 0}
											</TableCell>
											<TableCell>
												{policy.createdAt
													? new Date(policy.createdAt).toLocaleDateString(
															"ko-KR",
														)
													: "-"}
											</TableCell>
											<TableCell>
												<div className="flex gap-1">
													<Button
														isIconOnly
														size="sm"
														variant="light"
														aria-label="상세"
														onPress={() => onClickPolicyRow(policy.id)}
													>
														<Eye className="h-4 w-4" />
													</Button>
													<Button
														isIconOnly
														size="sm"
														variant="light"
														aria-label="수정"
														onPress={() => onClickEditPolicyButton(policy.id)}
													>
														<Edit className="h-4 w-4" />
													</Button>
													<Button
														isIconOnly
														size="sm"
														color="danger"
														variant="light"
														aria-label="삭제"
														onPress={() => onClickDeletePolicyButton(policy.id)}
													>
														<Trash2 className="h-4 w-4" />
													</Button>
												</div>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						)}
					</Surface>
					<p className="text-xs text-default-500">총 {totalCount}개 정책</p>
				</VStack>
			</div>
		);
	},
);

PolicyListPage.displayName = "PolicyListPage";
