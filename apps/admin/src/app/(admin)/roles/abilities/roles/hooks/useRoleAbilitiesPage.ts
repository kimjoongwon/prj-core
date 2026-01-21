"use client";

import {
	useGetRoles,
	useGetSubjects,
	useGetActions,
	useGetAbilitiesByRoleId,
	useGetSubjectFields,
	useCreateAbility,
	useUpdateAbility,
	useDeleteAbility,
	getGetAbilitiesByRoleIdQueryKey,
} from "@cocrepo/api";
import type { AbilityResponseDto } from "@cocrepo/api";
import type {
	AbilityFormData,
	AbilityRule,
	Action,
	Role,
	Subject,
} from "@cocrepo/ui";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalObservable } from "mobx-react-lite";
import { runInAction } from "mobx";

/**
 * Subject 확장 타입 (isSystem 포함)
 */
interface SubjectWithSystem extends Subject {
	/** 시스템 Subject 여부 */
	isSystem?: boolean;
}

/**
 * 페이지 상태 타입
 */
interface RoleAbilitiesPageState {
	/** 선택된 Role ID */
	selectedRoleId: string | null;
	/** 에러 메시지 */
	error: string | null;
	/** 현재 조회 중인 Subject ID (필드 로드용) */
	currentSubjectId: string | null;
}

/**
 * 값을 안전하게 문자열로 변환합니다.
 * Orval이 nullable string을 { [key: string]: unknown } | null로 잘못 생성하는 경우 대응
 */
function toSafeString(value: unknown): string {
	if (typeof value === "string") {
		return value;
	}
	return "";
}

/**
 * AbilityResponseDto를 AbilityRule로 변환합니다.
 */
function convertAbilityToRule(ability: AbilityResponseDto): AbilityRule {
	// API 응답의 subject/action 객체에서 안전하게 값 추출
	const subjectName = ability.subject?.name ?? "";
	const subjectDisplayName =
		toSafeString(ability.subject?.displayName) || subjectName;
	const actionName = ability.action?.name ?? "";
	const actionDisplayName =
		toSafeString(ability.action?.displayName) || actionName;

	return {
		id: ability.id,
		name: toSafeString(ability.name),
		subjectName,
		subjectDisplayName,
		actionName,
		actionDisplayName,
		inverted: ability.inverted,
		fields: ability.fields ?? [],
		conditions: ability.conditions as Record<string, unknown> | undefined,
		isActive: ability.isActive,
		priority: ability.priority,
	};
}

/**
 * Role 권한 관리 페이지 훅
 *
 * Role별 ABAC 권한 관리에 필요한 상태와 핸들러를 제공합니다.
 */
export function useRoleAbilitiesPage() {
	const queryClient = useQueryClient();

	// =====================
	// Query 훅 - 최상위에서 호출
	// =====================

	// Role 목록 조회
	const { data: rolesResponse, isLoading: isLoadingRoles } = useGetRoles();

	// Subject 목록 조회
	const { data: subjectsResponse, isLoading: isLoadingSubjects } =
		useGetSubjects();

	// Action 목록 조회
	const { data: actionsResponse, isLoading: isLoadingActions } = useGetActions();

	// 로컬 상태
	const state = useLocalObservable<RoleAbilitiesPageState>(() => ({
		selectedRoleId: null,
		error: null,
		currentSubjectId: null,
	}));

	// 선택된 Role의 권한 조회 (조건부 쿼리)
	const { data: abilitiesResponse, isLoading: isLoadingAbilities } =
		useGetAbilitiesByRoleId(state.selectedRoleId ?? "", {
			query: {
				enabled: state.selectedRoleId !== null,
			},
		});

	// Subject 필드 조회 (조건부 쿼리)
	const { data: fieldsResponse } = useGetSubjectFields(
		state.currentSubjectId ?? "",
		{
			query: {
				enabled: state.currentSubjectId !== null,
			},
		},
	);

	// =====================
	// Mutation 훅
	// =====================

	const createAbility = useCreateAbility();
	const updateAbility = useUpdateAbility();
	const deleteAbility = useDeleteAbility();

	// =====================
	// 데이터 변환
	// =====================

	/**
	 * Role 목록 변환
	 */
	const roles: Role[] =
		rolesResponse?.data?.map((role) => ({
			id: role.id,
			name: role.name,
			displayName: role.displayName ?? role.name,
		})) ?? [];

	/**
	 * Subject 목록 변환
	 */
	const subjects: SubjectWithSystem[] =
		subjectsResponse?.data?.map((subject) => ({
			id: subject.id,
			name: subject.name,
			displayName: toSafeString(subject.displayName) || subject.name,
			group: subject.group,
			isSystem: subject.isSystem,
		})) ?? [];

	/**
	 * Action 목록 변환
	 */
	const actions: Action[] =
		actionsResponse?.data?.map((action) => ({
			id: action.id,
			name: action.name,
			displayName: toSafeString(action.displayName) || action.name,
			group: toSafeString(action.group),
		})) ?? [];

	/**
	 * 로딩 상태 계산
	 */
	const isLoading = isLoadingRoles || isLoadingSubjects || isLoadingActions;

	// =====================
	// Role 권한 관리 핸들러
	// =====================

	/**
	 * Role 변경 핸들러
	 */
	const onChangeRoleSelect = (roleId: string) => {
		runInAction(() => {
			state.selectedRoleId = roleId;
		});
	};

	/**
	 * Role별 Ability 로드
	 */
	const onLoadRoleAbilities = async (
		roleId: string,
	): Promise<AbilityRule[]> => {
		// selectedRoleId 업데이트로 쿼리 트리거
		runInAction(() => {
			state.selectedRoleId = roleId;
		});

		// 이미 데이터가 있으면 변환해서 반환
		const abilities = (abilitiesResponse?.data ?? []) as AbilityResponseDto[];

		return abilities.map(convertAbilityToRule);
	};

	/**
	 * Role Ability 추가
	 */
	const onAddRoleAbility = async (
		roleId: string,
		data: AbilityFormData,
	): Promise<void> => {
		try {
			await createAbility.mutateAsync({
				data: {
					roleId,
					subjectName: data.subjectName,
					actionName: data.actionName,
					inverted: data.inverted ?? false,
					fields: data.fields ?? [],
					conditions: data.conditions as Record<string, unknown> | undefined,
					reason: data.reason,
					priority: data.priority ?? 0,
					isActive: true,
				},
			});

			// 캐시 무효화
			await queryClient.invalidateQueries({
				queryKey: getGetAbilitiesByRoleIdQueryKey(roleId),
			});
		} catch (err) {
			runInAction(() => {
				state.error = err instanceof Error ? err.message : "권한 추가 실패";
			});
			throw err;
		}
	};

	/**
	 * Role Ability 수정
	 */
	const onUpdateRoleAbility = async (
		abilityId: string,
		data: AbilityFormData,
	): Promise<void> => {
		try {
			await updateAbility.mutateAsync({
				id: abilityId,
				data: {
					subjectName: data.subjectName,
					actionName: data.actionName,
					inverted: data.inverted,
					fields: data.fields,
					conditions: data.conditions as Record<string, unknown> | undefined,
					reason: data.reason,
					priority: data.priority,
				},
			});

			// 캐시 무효화
			if (state.selectedRoleId) {
				await queryClient.invalidateQueries({
					queryKey: getGetAbilitiesByRoleIdQueryKey(state.selectedRoleId),
				});
			}
		} catch (err) {
			runInAction(() => {
				state.error = err instanceof Error ? err.message : "권한 수정 실패";
			});
			throw err;
		}
	};

	/**
	 * Role Ability 삭제
	 */
	const onDeleteRoleAbility = async (abilityId: string): Promise<void> => {
		try {
			await deleteAbility.mutateAsync({ id: abilityId });

			// 캐시 무효화
			if (state.selectedRoleId) {
				await queryClient.invalidateQueries({
					queryKey: getGetAbilitiesByRoleIdQueryKey(state.selectedRoleId),
				});
			}
		} catch (err) {
			runInAction(() => {
				state.error = err instanceof Error ? err.message : "권한 삭제 실패";
			});
			throw err;
		}
	};

	/**
	 * Role Ability 활성화 토글
	 */
	const onToggleRoleAbilityActive = async (
		abilityId: string,
		isActive: boolean,
	): Promise<void> => {
		try {
			await updateAbility.mutateAsync({
				id: abilityId,
				data: { isActive },
			});

			// 캐시 무효화
			if (state.selectedRoleId) {
				await queryClient.invalidateQueries({
					queryKey: getGetAbilitiesByRoleIdQueryKey(state.selectedRoleId),
				});
			}
		} catch (err) {
			runInAction(() => {
				state.error =
					err instanceof Error ? err.message : "활성화 상태 변경 실패";
			});
			throw err;
		}
	};

	// =====================
	// 공통 핸들러
	// =====================

	/**
	 * Subject 필드 로드 (DMMF 기반)
	 */
	const onLoadSubjectFields = async (
		subjectName: string,
	): Promise<string[]> => {
		// Subject ID 찾기
		const subject = subjects.find((s) => s.name === subjectName);
		if (!subject) {
			return [];
		}

		// Subject ID 설정으로 쿼리 트리거
		runInAction(() => {
			state.currentSubjectId = subject.id;
		});

		// 이미 데이터가 있으면 반환
		return fieldsResponse?.data?.map((field) => field.name) ?? [];
	};

	// =====================
	// 상태 객체 생성 (getter 패턴)
	// =====================

	const observableState = {
		get roles() {
			return roles;
		},
		get subjects() {
			return subjects;
		},
		get actions() {
			return actions;
		},
		get isLoading() {
			return isLoading;
		},
		get selectedRoleId() {
			return state.selectedRoleId;
		},
		get error() {
			return state.error;
		},
		get isLoadingAbilities() {
			return isLoadingAbilities;
		},
	};

	return {
		state: observableState,
		// Role 핸들러
		onChangeRoleSelect,
		onLoadRoleAbilities,
		onAddRoleAbility,
		onUpdateRoleAbility,
		onDeleteRoleAbility,
		onToggleRoleAbilityActive,
		// 공통 핸들러
		onLoadSubjectFields,
	};
}
