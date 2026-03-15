"use client";
import { useGetAbilitiesByRoleId } from "@cocrepo/api/core/abilities";
import { customInstance } from "@cocrepo/api/core/client";
import { useDeleteRole, useGetRoleById } from "@cocrepo/api/core/roles";

import {
	Page,
	PageSurface,
	PageTitleBar,
	Section,
	SectionSurface,
	VStack,
} from "@cocrepo/ui";
import {
	Button,
	Checkbox,
	Chip,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Spinner,
	Switch,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
	useDisclosure,
} from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	ArrowLeft,
	Edit,
	Save,
	ShieldCheck,
	ShieldX,
	Trash2,
} from "lucide-react";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useState } from "react";

interface RoleDetailPageClientProps {
	roleId: string;
}

/** Grant 배치 할당 항목 */
interface GrantItem {
	abilityId: string;
	isActive: boolean;
	priority: number;
}

/** Ability 응답 타입 */
interface AbilityItem {
	id: string;
	name: string;
	description?: string;
	subjectId: string;
	actionId: string;
	fields: string[];
	inverted: boolean;
	reason?: string;
	subject?: { id: string; name: string; displayName?: string };
	action?: { id: string; name: string; displayName?: string };
}

/**
 * 전체 Ability 목록 조회 (Orval 재생성 전 임시)
 */
function getAllAbilities() {
	return customInstance<{ data: AbilityItem[] }>({
		url: "/api/v1/abilities",
		method: "GET",
	});
}

/**
 * Role에 Grant 배치 할당 (Orval 재생성 전 임시)
 */
function batchAssignGrantsToRole(roleId: string, grants: GrantItem[]) {
	return customInstance<{ data: unknown[] }>({
		url: `/api/v1/grants/roles/${roleId}`,
		method: "PUT",
		data: { grants },
	});
}

/**
 * 역할 상세 페이지 - 클라이언트 컴포넌트
 */
function RoleDetailPageClient({ roleId }: RoleDetailPageClientProps) {
	const router = useRouter();
	const queryClient = useQueryClient();
	const deleteModal = useDisclosure();
	const saveModal = useDisclosure();

	// Grant 배치 편집 상태
	const [isEditingGrants, setIsEditingGrants] = useState(false);
	const [selectedAbilities, setSelectedAbilities] = useState<
		Map<string, GrantItem>
	>(new Map());
	const [hasChanges, setHasChanges] = useState(false);

	// API 조회
	const { data: response, isLoading } = useGetRoleById(roleId);
	const role = response?.data;

	// 역할별 권한 조회 (현재 Grant된 Ability)
	const { data: abilitiesResponse, isLoading: isLoadingAbilities } =
		useGetAbilitiesByRoleId(roleId);
	const grantedAbilities = abilitiesResponse?.data ?? [];

	// 전체 Ability 목록 조회 (Grant 편집 모드에서만)
	const { data: allAbilitiesResponse, isLoading: isLoadingAllAbilities } =
		useQuery({
			queryKey: ["abilities", "all"],
			queryFn: getAllAbilities,
			enabled: isEditingGrants,
		});
	const allAbilities = (allAbilitiesResponse?.data ?? []) as AbilityItem[];

	// 삭제 Mutation
	const { mutate: deleteRole, isPending: isDeleting } = useDeleteRole({
		mutation: {
			onSuccess: () => {
				deleteModal.onClose();
				router.push("/roles" as Route);
			},
		},
	});

	// Grant 배치 할당 Mutation
	const { mutate: saveBatchGrants, isPending: isSavingGrants } = useMutation({
		mutationFn: (grants: GrantItem[]) =>
			batchAssignGrantsToRole(roleId, grants),
		onSuccess: () => {
			saveModal.onClose();
			setIsEditingGrants(false);
			setHasChanges(false);
			// 권한 목록 새로고침
			queryClient.invalidateQueries({
				queryKey: [`/api/v1/abilities/roles/${roleId}`],
			});
		},
	});

	/**
	 * 뒤로가기 핸들러
	 */
	const onClickBackButton = () => {
		router.push("/roles" as Route);
	};

	/**
	 * 수정 페이지 이동 핸들러
	 */
	const onClickEditButton = () => {
		router.push(`/roles/${roleId}/edit` as Route);
	};

	/**
	 * 삭제 확인 핸들러
	 */
	const onClickDeleteConfirm = () => {
		deleteRole({ id: roleId });
	};

	/**
	 * Grant 편집 모드 진입
	 */
	const onClickEditGrants = () => {
		// 현재 Grant된 Ability를 초기 선택 상태로 설정
		const initial = new Map<string, GrantItem>();
		for (const ability of grantedAbilities) {
			initial.set(ability.id, {
				abilityId: ability.id,
				isActive: true,
				priority: 0,
			});
		}
		setSelectedAbilities(initial);
		setIsEditingGrants(true);
		setHasChanges(false);
	};

	/**
	 * Grant 편집 취소
	 */
	const onClickCancelEditGrants = () => {
		setIsEditingGrants(false);
		setHasChanges(false);
	};

	/**
	 * Ability 선택/해제 토글
	 */
	const onToggleAbilityCheckbox = (abilityId: string) => {
		const next = new Map(selectedAbilities);
		if (next.has(abilityId)) {
			next.delete(abilityId);
		} else {
			next.set(abilityId, {
				abilityId,
				isActive: true,
				priority: 0,
			});
		}
		setSelectedAbilities(next);
		setHasChanges(true);
	};

	/**
	 * Grant isActive 토글
	 */
	const onToggleGrantActiveSwitch = (abilityId: string, isActive: boolean) => {
		const next = new Map(selectedAbilities);
		const item = next.get(abilityId);
		if (item) {
			next.set(abilityId, { ...item, isActive });
			setSelectedAbilities(next);
			setHasChanges(true);
		}
	};

	/**
	 * Grant priority 변경
	 */
	const onChangeGrantPriorityInput = (abilityId: string, priority: number) => {
		const next = new Map(selectedAbilities);
		const item = next.get(abilityId);
		if (item) {
			next.set(abilityId, { ...item, priority });
			setSelectedAbilities(next);
			setHasChanges(true);
		}
	};

	/**
	 * Grant 배치 저장 확인 모달 열기
	 */
	const onClickSaveGrants = () => {
		saveModal.onOpen();
	};

	/**
	 * Grant 배치 저장 실행
	 */
	const onClickConfirmSaveGrants = () => {
		const grants = Array.from(selectedAbilities.values());
		saveBatchGrants(grants);
	};

	/** 변경 요약 계산 */
	const getChangeSummary = () => {
		const currentIds = new Set(grantedAbilities.map((a) => a.id));
		const nextIds = new Set(selectedAbilities.keys());

		const added = [...nextIds].filter((id) => !currentIds.has(id));
		const removed = [...currentIds].filter((id) => !nextIds.has(id));
		const kept = [...nextIds].filter((id) => currentIds.has(id));

		return { added: added.length, removed: removed.length, kept: kept.length };
	};

	if (isLoading) {
		return (
			<Page top={<PageTitleBar title="역할 상세" description="로딩 중..." />}>
				<PageSurface>
					<SectionSurface>
						<div className="flex items-center justify-center p-8">
							<span className="text-default-500">로딩 중...</span>
						</div>
					</SectionSurface>
				</PageSurface>
			</Page>
		);
	}

	if (!role) {
		return (
			<Page
				top={
					<PageTitleBar
						title="역할 상세"
						description="역할을 찾을 수 없습니다."
					/>
				}
			>
				<PageSurface>
					<SectionSurface>
						<div className="flex flex-col items-center justify-center gap-4 p-8">
							<p className="text-default-500">역할을 찾을 수 없습니다.</p>
							<Button variant="flat" onPress={onClickBackButton}>
								목록으로
							</Button>
						</div>
					</SectionSurface>
				</PageSurface>
			</Page>
		);
	}

	const summary = getChangeSummary();
	const pageActions: ReactNode = (
		<div className="flex gap-2">
			<Button
				variant="light"
				startContent={<ArrowLeft className="h-4 w-4" />}
				onPress={onClickBackButton}
			>
				목록으로
			</Button>
			{!role?.isSystem && (
				<>
					<Button
						variant="flat"
						color="primary"
						startContent={<Edit className="h-4 w-4" />}
						onPress={onClickEditButton}
					>
						수정
					</Button>
					<Button
						variant="flat"
						color="danger"
						startContent={<Trash2 className="h-4 w-4" />}
						onPress={deleteModal.onOpen}
					>
						삭제
					</Button>
				</>
			)}
		</div>
	);

	return (
		<Page
			top={
				<PageTitleBar
					title="역할 상세"
					description={`${role.displayName || role.name} 역할의 상세 정보입니다.`}
					actions={pageActions}
				/>
			}
		>
			<PageSurface>
				<VStack gap={4}>
					{role.isSystem && (
						<div className="rounded-xl bg-warning-50 p-4 dark:bg-warning-900/20">
							<p className="text-sm text-warning-700 dark:text-warning-400">
								<strong>시스템 역할:</strong>이 역할은 시스템에서 기본 제공하는
								역할로, 수정하거나 삭제할 수 없습니다.
							</p>
						</div>
					)}
					<SectionSurface>
						<Section>
							<h3 className="text-lg font-semibold mb-4">기본 정보</h3>
							<dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<dt className="text-sm text-default-500 mb-1">역할 식별자</dt>
									<dd className="flex items-center gap-2">
										<span className="font-mono">{role.name}</span>
										{role.isSystem && (
											<Chip size="sm" color="warning" variant="flat">
												시스템
											</Chip>
										)}
									</dd>
								</div>
								<div>
									<dt className="text-sm text-default-500 mb-1">표시명</dt>
									<dd>{role.displayName || "-"}</dd>
								</div>
								<div className="md:col-span-2">
									<dt className="text-sm text-default-500 mb-1">설명</dt>
									<dd className="text-default-600">
										{role.description || "-"}
									</dd>
								</div>
							</dl>
						</Section>
					</SectionSurface>
					<SectionSurface>
						<Section>
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-lg font-semibold">권한 목록</h3>
								{!isEditingGrants ? (
									<Button
										size="sm"
										variant="flat"
										color="primary"
										startContent={<Edit className="h-3.5 w-3.5" />}
										onPress={onClickEditGrants}
									>
										권한 편집
									</Button>
								) : (
									<div className="flex gap-2">
										<Button
											size="sm"
											variant="flat"
											onPress={onClickCancelEditGrants}
										>
											취소
										</Button>
										<Button
											size="sm"
											color="primary"
											startContent={<Save className="h-3.5 w-3.5" />}
											isDisabled={!hasChanges}
											onPress={onClickSaveGrants}
										>
											저장
										</Button>
									</div>
								)}
							</div>
							{isEditingGrants ? (
								isLoadingAllAbilities ? (
									<div className="flex items-center justify-center p-8">
										<Spinner size="sm" />
										<span className="ml-2 text-default-500">
											전체 권한 로딩 중...
										</span>
									</div>
								) : allAbilities.length === 0 ? (
									<div className="text-center text-default-500 py-8">
										등록된 권한 정의가 없습니다.
									</div>
								) : (
									<Table aria-label="권한 배치 할당" removeWrapper>
										<TableHeader>
											<TableColumn width={50}>선택</TableColumn>
											<TableColumn>대상 (Subject)</TableColumn>
											<TableColumn>액션 (Action)</TableColumn>
											<TableColumn>유형</TableColumn>
											<TableColumn width={80}>활성</TableColumn>
											<TableColumn width={100}>우선순위</TableColumn>
										</TableHeader>
										<TableBody>
											{allAbilities.map((ability) => {
												const isSelected = selectedAbilities.has(ability.id);
												const grantItem = selectedAbilities.get(ability.id);
												return (
													<TableRow key={ability.id}>
														<TableCell>
															<Checkbox
																isSelected={isSelected}
																onValueChange={() =>
																	onToggleAbilityCheckbox(ability.id)
																}
															/>
														</TableCell>
														<TableCell>
															<span className="font-medium">
																{String(
																	ability.subject?.displayName ||
																		ability.subject?.name ||
																		ability.subjectId,
																)}
															</span>
														</TableCell>
														<TableCell>
															<span className="font-mono text-sm">
																{String(
																	ability.action?.displayName ||
																		ability.action?.name ||
																		ability.actionId,
																)}
															</span>
														</TableCell>
														<TableCell>
															{ability.inverted ? (
																<Chip
																	size="sm"
																	color="danger"
																	variant="flat"
																	startContent={<ShieldX className="h-3 w-3" />}
																>
																	거부
																</Chip>
															) : (
																<Chip
																	size="sm"
																	color="success"
																	variant="flat"
																	startContent={
																		<ShieldCheck className="h-3 w-3" />
																	}
																>
																	허용
																</Chip>
															)}
														</TableCell>
														<TableCell>
															{isSelected && (
																<Switch
																	size="sm"
																	isSelected={grantItem?.isActive ?? true}
																	onValueChange={(val) =>
																		onToggleGrantActiveSwitch(ability.id, val)
																	}
																/>
															)}
														</TableCell>
														<TableCell>
															{isSelected && (
																<Input
																	type="number"
																	size="sm"
																	min={0}
																	max={100}
																	value={String(grantItem?.priority ?? 0)}
																	onValueChange={(val) =>
																		onChangeGrantPriorityInput(
																			ability.id,
																			Number(val) || 0,
																		)
																	}
																	className="w-20"
																/>
															)}
														</TableCell>
													</TableRow>
												);
											})}
										</TableBody>
									</Table>
								)
							) : isLoadingAbilities ? (
								<div className="flex items-center justify-center p-8">
									<Spinner size="sm" />
									<span className="ml-2 text-default-500">권한 로딩 중...</span>
								</div>
							) : grantedAbilities.length === 0 ? (
								<div className="text-center text-default-500 py-8">
									등록된 권한이 없습니다.
								</div>
							) : (
								<Table aria-label="역할 권한 목록" removeWrapper>
									<TableHeader>
										<TableColumn>대상 (Subject)</TableColumn>
										<TableColumn>액션 (Action)</TableColumn>
										<TableColumn>필드</TableColumn>
										<TableColumn>유형</TableColumn>
									</TableHeader>
									<TableBody>
										{grantedAbilities.map((ability) => (
											<TableRow key={ability.id}>
												<TableCell>
													<span className="font-medium">
														{String(
															ability.subject?.displayName ||
																ability.subject?.name ||
																ability.subjectId,
														)}
													</span>
												</TableCell>
												<TableCell>
													<span className="font-mono text-sm">
														{String(
															ability.action?.displayName ||
																ability.action?.name ||
																ability.actionId,
														)}
													</span>
												</TableCell>
												<TableCell>
													{ability.fields.length > 0 ? (
														<div className="flex flex-wrap gap-1">
															{ability.fields.slice(0, 3).map((field) => (
																<Chip key={field} size="sm" variant="flat">
																	{field}
																</Chip>
															))}
															{ability.fields.length > 3 && (
																<Chip size="sm" variant="flat" color="default">
																	+{ability.fields.length - 3}
																</Chip>
															)}
														</div>
													) : (
														<span className="text-default-400">전체</span>
													)}
												</TableCell>
												<TableCell>
													{ability.inverted ? (
														<Chip
															size="sm"
															color="danger"
															variant="flat"
															startContent={<ShieldX className="h-3 w-3" />}
														>
															거부
														</Chip>
													) : (
														<Chip
															size="sm"
															color="success"
															variant="flat"
															startContent={<ShieldCheck className="h-3 w-3" />}
														>
															허용
														</Chip>
													)}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							)}
						</Section>
					</SectionSurface>
					<SectionSurface>
						<Section>
							<h3 className="text-lg font-semibold mb-4">추가 정보</h3>
							<dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<dt className="text-sm text-default-500 mb-1">상태</dt>
									<dd>
										<Chip
											size="sm"
											color={role.removedAt ? "danger" : "success"}
											variant="flat"
										>
											{role.removedAt ? "삭제됨" : "활성"}
										</Chip>
									</dd>
								</div>
								<div>
									<dt className="text-sm text-default-500 mb-1">생성일</dt>
									<dd>{new Date(role.createdAt).toLocaleString("ko-KR")}</dd>
								</div>
								<div>
									<dt className="text-sm text-default-500 mb-1">수정일</dt>
									<dd>{new Date(role.updatedAt).toLocaleString("ko-KR")}</dd>
								</div>
							</dl>
						</Section>
					</SectionSurface>
				</VStack>
			</PageSurface>
			<Modal isOpen={deleteModal.isOpen} onClose={deleteModal.onClose}>
				<ModalContent>
					<ModalHeader>역할 삭제</ModalHeader>
					<ModalBody>
						<p>
							<strong>{role.displayName || role.name}</strong>역할을
							삭제하시겠습니까?
						</p>
						<p className="text-sm text-danger mt-2">
							이 작업은 되돌릴 수 없습니다.
						</p>
					</ModalBody>
					<ModalFooter>
						<Button
							variant="flat"
							onPress={deleteModal.onClose}
							isDisabled={isDeleting}
						>
							취소
						</Button>
						<Button
							color="danger"
							onPress={onClickDeleteConfirm}
							isLoading={isDeleting}
						>
							삭제
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
			<Modal isOpen={saveModal.isOpen} onClose={saveModal.onClose}>
				<ModalContent>
					<ModalHeader>권한 변경 확인</ModalHeader>
					<ModalBody>
						<p>권한 변경사항을 저장하시겠습니까?</p>
						<div className="flex flex-col gap-2 mt-3 p-3 rounded-lg bg-default-100">
							<div className="flex items-center justify-between text-sm">
								<span className="text-default-600">추가</span>
								<Chip size="sm" color="success" variant="flat">
									+{summary.added}개
								</Chip>
							</div>
							<div className="flex items-center justify-between text-sm">
								<span className="text-default-600">제거</span>
								<Chip size="sm" color="danger" variant="flat">
									-{summary.removed}개
								</Chip>
							</div>
							<div className="flex items-center justify-between text-sm">
								<span className="text-default-600">유지</span>
								<Chip size="sm" variant="flat">
									{summary.kept}개
								</Chip>
							</div>
						</div>
					</ModalBody>
					<ModalFooter>
						<Button
							variant="flat"
							onPress={saveModal.onClose}
							isDisabled={isSavingGrants}
						>
							취소
						</Button>
						<Button
							color="primary"
							onPress={onClickConfirmSaveGrants}
							isLoading={isSavingGrants}
						>
							저장
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Page>
	);
}

export default observer(RoleDetailPageClient);
