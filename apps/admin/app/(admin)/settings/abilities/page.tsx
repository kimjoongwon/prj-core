"use client";

import { Text } from "@cocrepo/ui";
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Checkbox,
	Chip,
	Spinner,
	Tab,
	Tabs,
	Tooltip,
} from "@heroui/react";
import {
	Roles,
	useGetAbilitiesByRoleId,
	useGetAllSubjects,
	useUpdateRoleAbilities,
} from "@cocrepo/api";
import { usePermission } from "@cocrepo/hook";
import { Save, ShieldCheck } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useRef } from "react";
import { AbilitiesPageStore } from "./_stores";

/** 역할별 표시 이름 */
const ROLE_LABELS: Record<Roles, string> = {
	SUPER_ADMIN: "최고 관리자",
	ADMIN: "관리자",
	USER: "일반 사용자",
};

/** Subject 타입별 표시 이름 */
const SUBJECT_TYPE_LABELS: Record<string, string> = {
	Menu: "메뉴",
	Feature: "기능",
	Entity: "엔티티",
	API: "API",
	Column: "컬럼",
};

/** 액션별 표시 이름 */
const ACTION_LABELS: Record<string, string> = {
	ACCESS: "접근",
	CREATE: "생성",
	READ: "조회",
	UPDATE: "수정",
	DELETE: "삭제",
	MANAGE: "관리",
	EXPORT: "내보내기",
	IMPORT: "가져오기",
	APPROVE: "승인",
	REJECT: "거부",
};

/** Subject 타입별 기본 액션 */
const ACTIONS_BY_SUBJECT_TYPE: Record<string, string[]> = {
	Menu: ["ACCESS"],
	Feature: ["ACCESS"],
	Entity: ["CREATE", "READ", "UPDATE", "DELETE", "EXPORT", "IMPORT"],
	API: ["ACCESS"],
	Column: ["READ", "UPDATE"],
};

/**
 * 권한 관리 페이지
 *
 * 역할별 권한을 관리합니다.
 * - 역할 선택 (탭)
 * - Subject 타입별 그룹화된 권한 목록
 * - 권한 활성화/비활성화 토글
 * - 변경사항 저장
 */
function AbilitiesPage() {
	const storeRef = useRef<AbilitiesPageStore | null>(null);

	// Store 초기화
	if (!storeRef.current) {
		storeRef.current = new AbilitiesPageStore();
	}
	const store = storeRef.current;

	// 권한 확인 - MANAGE 권한이 있는 사용자만 수정 가능
	const canManageAbilities = usePermission("MANAGE", "entity:Ability");

	// Subject 목록 조회
	const {
		data: subjectsData,
		isLoading: isLoadingSubjects,
	} = useGetAllSubjects();

	// 역할별 권한 조회 (선택된 역할 기준)
	// roleId가 필요하지만 현재 API에서 role name으로 조회 가능한지 확인 필요
	// 우선 임시로 빈 문자열로 설정
	const {
		data: abilitiesData,
		isLoading: isLoadingAbilities,
		refetch: refetchAbilities,
	} = useGetAbilitiesByRoleId(store.selectedRole, {
		query: {
			enabled: !!store.selectedRole,
		},
	});

	// 권한 수정 mutation
	const updateAbilitiesMutation = useUpdateRoleAbilities();

	// Subject 목록 설정
	useEffect(() => {
		if (subjectsData?.data) {
			store.setSubjects(subjectsData.data);
		}
	}, [subjectsData, store]);

	// 권한 목록 설정
	useEffect(() => {
		if (abilitiesData?.data) {
			store.setAbilities(abilitiesData.data);
		}
	}, [abilitiesData, store]);

	// 로딩 상태 설정
	useEffect(() => {
		store.setLoading(isLoadingSubjects || isLoadingAbilities);
	}, [isLoadingSubjects, isLoadingAbilities, store]);

	// 역할 선택 핸들러
	const handleSelectRole = useCallback(
		(key: React.Key) => {
			store.setSelectedRole(key as Roles);
		},
		[store],
	);

	// 권한 토글 핸들러
	const handleToggleAbility = useCallback(
		(subjectId: string, action: string) => {
			if (!canManageAbilities) return;
			store.toggleAbility(subjectId, action);
		},
		[store, canManageAbilities],
	);

	// 저장 핸들러
	const handleSave = useCallback(async () => {
		if (!canManageAbilities || !store.hasChanges) return;

		store.setSaving(true);
		store.setError(null);

		try {
			const abilities = store.getChangedAbilitiesAsDto();
			await updateAbilitiesMutation.mutateAsync({
				roleId: store.selectedRole,
				data: { abilities },
			});

			// 성공 시 데이터 새로고침
			await refetchAbilities();
			store.resetChanges();
		} catch (error) {
			store.setError("권한 저장에 실패했습니다.");
			console.error("Failed to save abilities:", error);
		} finally {
			store.setSaving(false);
		}
	}, [store, canManageAbilities, updateAbilitiesMutation, refetchAbilities]);

	// 변경사항 초기화 핸들러
	const handleReset = useCallback(() => {
		store.resetChanges();
	}, [store]);

	return (
		<div className="flex flex-col gap-6 p-4 md:p-6">
			{/* 헤더 */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex flex-col gap-1">
					<div className="flex items-center gap-2">
						<ShieldCheck className="h-6 w-6 text-primary" />
						<Text className="text-2xl font-bold md:text-3xl">권한 관리</Text>
					</div>
					<Text className="text-default-500">
						역할별 권한을 설정하고 관리합니다
					</Text>
				</div>

				{/* 저장 버튼 */}
				{canManageAbilities && (
					<div className="flex gap-2">
						{store.hasChanges && (
							<Button
								variant="flat"
								onPress={handleReset}
								isDisabled={store.isSaving}
							>
								<Text>초기화</Text>
							</Button>
						)}
						<Button
							color="primary"
							startContent={
								store.isSaving ? (
									<Spinner size="sm" color="current" />
								) : (
									<Save className="h-4 w-4" />
								)
							}
							onPress={handleSave}
							isDisabled={!store.hasChanges || store.isSaving}
						>
							<Text>{store.isSaving ? "저장 중..." : "변경사항 저장"}</Text>
						</Button>
					</div>
				)}
			</div>

			{/* 에러 표시 */}
			{store.error && (
				<div className="rounded-lg bg-danger-50 p-4">
					<Text className="text-danger">{store.error}</Text>
				</div>
			)}

			{/* 역할 탭 */}
			<Card className="border-none shadow-sm">
				<CardBody className="p-0">
					<Tabs
						selectedKey={store.selectedRole}
						onSelectionChange={handleSelectRole}
						aria-label="역할 선택"
						classNames={{
							tabList: "gap-6 w-full px-4 pt-4",
							tab: "px-4 h-10",
							tabContent: "text-default-500",
						}}
					>
						{Object.entries(ROLE_LABELS).map(([role, label]) => (
							<Tab key={role} title={label} />
						))}
					</Tabs>
				</CardBody>
			</Card>

			{/* 권한 목록 */}
			{store.isLoading ? (
				<div className="flex items-center justify-center py-12">
					<Spinner size="lg" />
				</div>
			) : (
				<div className="flex flex-col gap-4">
					{Object.entries(store.subjectsByType).map(
						([type, subjects]) =>
							subjects.length > 0 && (
								<Card key={type} className="border-none shadow-sm">
									<CardHeader className="flex items-center gap-2 px-6 pb-0 pt-4">
										<Chip size="sm" variant="flat" color="primary">
											{SUBJECT_TYPE_LABELS[type] ?? type}
										</Chip>
										<Text className="text-sm text-default-500">
											{subjects.length}개의 항목
										</Text>
									</CardHeader>
									<CardBody className="gap-2 px-6 py-4">
										<div className="overflow-x-auto">
											<table className="w-full min-w-[600px]">
												<thead>
													<tr className="border-b border-default-200">
														<th className="py-3 text-left">
															<Text className="text-sm font-medium text-default-500">
																항목
															</Text>
														</th>
														{(ACTIONS_BY_SUBJECT_TYPE[type] ?? []).map(
															(action) => (
																<th
																	key={action}
																	className="px-2 py-3 text-center"
																>
																	<Text className="text-sm font-medium text-default-500">
																		{ACTION_LABELS[action] ?? action}
																	</Text>
																</th>
															),
														)}
													</tr>
												</thead>
												<tbody>
													{subjects.map((subject) => (
														<tr
															key={subject.id}
															className="border-b border-default-100 last:border-0"
														>
															<td className="py-3">
																<div className="flex flex-col">
																	<Text className="font-medium">
																		{typeof subject.label === "string"
																			? subject.label
																			: subject.name}
																	</Text>
																	{typeof subject.description === "string" &&
																		subject.description && (
																			<Text className="text-xs text-default-400">
																				{subject.description}
																			</Text>
																		)}
																</div>
															</td>
															{(ACTIONS_BY_SUBJECT_TYPE[type] ?? []).map(
																(action) => (
																	<td
																		key={action}
																		className="px-2 py-3 text-center"
																	>
																		<Tooltip
																			content={
																				canManageAbilities
																					? `${typeof subject.label === "string" ? subject.label : subject.name}에 대한 ${ACTION_LABELS[action] ?? action} 권한`
																					: "권한 수정 권한이 없습니다"
																			}
																		>
																			<div className="flex justify-center">
																				<Checkbox
																					isSelected={store.hasAbility(
																						subject.id,
																						action,
																					)}
																					onValueChange={() =>
																						handleToggleAbility(
																							subject.id,
																							action,
																						)
																					}
																					isDisabled={!canManageAbilities}
																					size="sm"
																					aria-label={`${subject.name} ${action}`}
																				/>
																			</div>
																		</Tooltip>
																	</td>
																),
															)}
														</tr>
													))}
												</tbody>
											</table>
										</div>
									</CardBody>
								</Card>
							),
					)}
				</div>
			)}

			{/* 변경사항 안내 */}
			{store.hasChanges && (
				<div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 transform">
					<Card className="border border-primary-200 bg-primary-50 shadow-lg">
						<CardBody className="flex flex-row items-center gap-4 px-4 py-3">
							<Text className="text-primary">
								저장되지 않은 변경사항이 있습니다
							</Text>
							<div className="flex gap-2">
								<Button size="sm" variant="flat" onPress={handleReset}>
									<Text>초기화</Text>
								</Button>
								<Button
									size="sm"
									color="primary"
									onPress={handleSave}
									isDisabled={store.isSaving}
								>
									<Text>저장</Text>
								</Button>
							</div>
						</CardBody>
					</Card>
				</div>
			)}
		</div>
	);
}

export default observer(AbilitiesPage);
