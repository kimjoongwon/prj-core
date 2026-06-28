"use client";

import type { PolicyResponseDto } from "@cocrepo/api/core/policies";
import { PageTitleBar, Section, SectionSurface, VStack } from "@cocrepo/ui";
import { Spinner, Table } from "@heroui/react";
import { Edit, Eye, Plus, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Button } from "../../action/Button/Button";
import { Chip } from "../../data-display/Chip/Chip";
export interface PolicyListScreenProps {
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
export const PolicyListScreen = observer(
	({
		policies,
		totalCount,
		isLoading,
		onClickCreateButton,
		onClickPolicyRow,
		onClickEditPolicyButton,
		onClickDeletePolicyButton,
	}: PolicyListScreenProps) => {
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
				<VStack>
					<SectionSurface className="rounded-2xl border-border/80 bg-surface/70">
						<Section overflow="hidden">
							<Section.Body>
								{isLoading ? (
									<div className="flex items-center justify-center gap-2 p-8">
										<Spinner size="sm" />
										<span className="text-muted">정책을 불러오는 중...</span>
									</div>
								) : (
									<Table aria-label="정책 목록">
										<Table.Content>
											<Table.Header>
												<Table.Column>정책</Table.Column>
												<Table.Column>유형</Table.Column>
												<Table.Column>Ability</Table.Column>
												<Table.Column>생성일</Table.Column>
												<Table.Column>작업</Table.Column>
											</Table.Header>
											<Table.Body>
												{policyRows.map((policy) => (
													<Table.Row key={policy.id}>
														<Table.Cell>
															<button
																className="text-left"
																type="button"
																onClick={() => onClickPolicyRow(policy.id)}
															>
																<p className="font-semibold">
																	{getPolicyLabel(policy)}
																</p>
																<p className="text-xs text-muted">
																	{policy.description || policy.name}
																</p>
															</button>
														</Table.Cell>
														<Table.Cell>
															<Chip size="sm" variant="flat">
																{policy.isSystem ? "시스템" : "공간"}
															</Chip>
														</Table.Cell>
														<Table.Cell>
															{policy.policyAbilities?.length ?? 0}
														</Table.Cell>
														<Table.Cell>
															{policy.createdAt
																? new Date(policy.createdAt).toLocaleDateString(
																		"ko-KR",
																	)
																: "-"}
														</Table.Cell>
														<Table.Cell>
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
																	onPress={() =>
																		onClickEditPolicyButton(policy.id)
																	}
																>
																	<Edit className="h-4 w-4" />
																</Button>
																<Button
																	isIconOnly
																	size="sm"
																	color="danger"
																	variant="light"
																	aria-label="삭제"
																	onPress={() =>
																		onClickDeletePolicyButton(policy.id)
																	}
																>
																	<Trash2 className="h-4 w-4" />
																</Button>
															</div>
														</Table.Cell>
													</Table.Row>
												))}
											</Table.Body>
										</Table.Content>
									</Table>
								)}
							</Section.Body>
						</Section>
					</SectionSurface>
					<p className="text-xs text-muted">총 {totalCount}개 정책</p>
				</VStack>
			</div>
		);
	},
);
PolicyListScreen.displayName = "PolicyListScreen";
