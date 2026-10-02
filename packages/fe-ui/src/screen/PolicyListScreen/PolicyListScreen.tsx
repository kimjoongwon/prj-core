"use client";

import type { PolicyResponseDto } from "@cocrepo/api/core/policies";
import { HStack, Screen, Section, SectionSurface, VStack } from "@cocrepo/ui";
import { Spinner, Table } from "@heroui/react";
import { Edit, Eye, Plus, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Button } from "../../input/Button/Button";
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
			<VStack gap="page">
				<Screen.Header
					title="정책 목록"
					description="역할과 사용자에 할당할 정책 기반 인가 규칙을 관리합니다."
					actions={
						<Button
							variant="primary"
							startContent={<Plus className="h-4 w-4" />}
							onPress={onClickCreateButton}
						>
							정책 추가
						</Button>
					}
				/>
				<VStack>
					<SectionSurface className="rounded-2xl border-border/80 bg-surface">
						<Section overflow="hidden">
							<Section.Body>
								{isLoading ? (
									<HStack
										alignItems="center"
										justifyContent="center"
										className="p-8"
									>
										<Spinner size="sm" />
										<span className="text-muted">정책을 불러오는 중...</span>
									</HStack>
								) : (
									<Table aria-label="정책 목록">
										<Table.Content>
											<Table.Header>
												<Table.Column>정책</Table.Column>
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
																onClick={() =>
																	onClickPolicyRow(String(policy.id))
																}
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
															{policy.entries?.length ?? 0}
														</Table.Cell>
														<Table.Cell>
															{policy.createdAt
																? new Date(policy.createdAt).toLocaleDateString(
																		"ko-KR",
																	)
																: "-"}
														</Table.Cell>
														<Table.Cell>
															<HStack gap="dense">
																<Button
																	isIconOnly
																	size="sm"
																	variant="ghost"
																	aria-label="상세"
																	onPress={() =>
																		onClickPolicyRow(String(policy.id))
																	}
																>
																	<Eye className="h-4 w-4" />
																</Button>
																<Button
																	isIconOnly
																	size="sm"
																	variant="ghost"
																	aria-label="수정"
																	onPress={() =>
																		onClickEditPolicyButton(String(policy.id))
																	}
																>
																	<Edit className="h-4 w-4" />
																</Button>
																<Button
																	isIconOnly
																	size="sm"
																	variant="ghost"
																	aria-label="삭제"
																	onPress={() =>
																		onClickDeletePolicyButton(String(policy.id))
																	}
																>
																	<Trash2 className="h-4 w-4" />
																</Button>
															</HStack>
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
			</VStack>
		);
	},
);
PolicyListScreen.displayName = "PolicyListScreen";
