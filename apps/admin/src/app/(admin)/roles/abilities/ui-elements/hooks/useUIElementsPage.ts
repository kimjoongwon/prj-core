"use client";

import {
	useGetRoles,
	useGetSubjects,
	useSetRoleAbilities,
	getGetAbilitiesByRoleIdQueryKey,
} from "@cocrepo/api";
import type { Role, Subject } from "@cocrepo/ui";
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
 * 가시성 상태 타입
 */
type VisibilityStatus = "visible" | "hidden" | "limited";

/**
 * 가시성 변경 데이터
 */
interface VisibilityChange {
	subjectId: string;
	roleId: string;
	status: VisibilityStatus;
}

/**
 * 페이지 상태 타입
 */
interface UIElementsPageState {
	/** 에러 메시지 */
	error: string | null;
	/** 수정 여부 */
	isDirty: boolean;
	/** 변경된 가시성 목록 */
	changes: VisibilityChange[];
}

/**
 * UI 가시성 페이지 훅
 *
 * Role별 UI 요소(ui:xxx Subject) 가시성 관리를 위한 상태와 핸들러를 제공합니다.
 */
export function useUIElementsPage() {
	const queryClient = useQueryClient();

	// =====================
	// Query 훅 - 최상위에서 호출
	// =====================

	// Role 목록 조회
	const { data: rolesResponse, isLoading: isLoadingRoles } = useGetRoles();

	// Subject 목록 조회 (ui 그룹만 필터링)
	const { data: subjectsResponse, isLoading: isLoadingSubjects } =
		useGetSubjects({ type: "ui" });

	// Mutation 훅
	const setRoleAbilities = useSetRoleAbilities();

	// 로컬 상태
	const state = useLocalObservable<UIElementsPageState>(() => ({
		error: null,
		isDirty: false,
		changes: [],
	}));

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
	 * Subject 목록 변환 (ui: 접두어로 필터링)
	 */
	const subjects: SubjectWithSystem[] =
		subjectsResponse?.data
			?.filter((subject) => subject.name.startsWith("ui:"))
			.map((subject) => ({
				id: subject.id,
				name: subject.name,
				displayName: subject.displayName ?? subject.name,
				group: subject.group,
				isSystem: subject.isSystem,
			})) ?? [];

	/**
	 * 로딩 상태 계산
	 */
	const isLoading = isLoadingRoles || isLoadingSubjects;

	// =====================
	// 가시성 관리 핸들러
	// =====================

	/**
	 * 가시성 변경 핸들러
	 */
	const onChangeVisibility = (
		subjectId: string,
		roleId: string,
		status: VisibilityStatus,
	) => {
		runInAction(() => {
			// 기존 변경 찾기
			const existingIndex = state.changes.findIndex(
				(c) => c.subjectId === subjectId && c.roleId === roleId,
			);

			if (existingIndex >= 0) {
				// 기존 변경 업데이트
				state.changes[existingIndex] = { subjectId, roleId, status };
			} else {
				// 새 변경 추가
				state.changes.push({ subjectId, roleId, status });
			}

			state.isDirty = true;
		});
	};

	/**
	 * 저장 핸들러
	 * TODO: UI 가시성 저장을 위한 전용 API가 추가되면 실제 API 호출로 교체
	 */
	const onSave = async () => {
		try {
			// TODO: 변경사항을 역할별로 그룹화하여 저장
			// 현재는 개별 Role별로 setRoleAbilities를 호출하는 방식
			// 향후 UI 가시성 전용 API가 추가되면 교체

			// 변경사항을 역할별로 그룹화
			const changesByRole = state.changes.reduce(
				(acc, change) => {
					if (!acc[change.roleId]) {
						acc[change.roleId] = [];
					}
					acc[change.roleId].push(change);
					return acc;
				},
				{} as Record<string, VisibilityChange[]>,
			);

			// 각 역할별로 API 호출
			for (const [roleId, changes] of Object.entries(changesByRole)) {
				const subject = subjects.find((s) =>
					changes.some((c) => c.subjectId === s.id),
				);
				if (!subject) continue;

				// TODO: 실제 가시성 저장 API 호출
				console.log("Save visibility for role:", roleId, changes);

				// 캐시 무효화
				await queryClient.invalidateQueries({
					queryKey: getGetAbilitiesByRoleIdQueryKey(roleId),
				});
			}

			runInAction(() => {
				state.isDirty = false;
				state.changes = [];
			});
		} catch (err) {
			runInAction(() => {
				state.error = err instanceof Error ? err.message : "저장 실패";
			});
			throw err;
		}
	};

	/**
	 * 초기화 핸들러
	 */
	const onReset = () => {
		runInAction(() => {
			state.changes = [];
			state.isDirty = false;
		});
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
		get isLoading() {
			return isLoading;
		},
		get error() {
			return state.error;
		},
		get isDirty() {
			return state.isDirty;
		},
	};

	return {
		state: observableState,
		onChangeVisibility,
		onSave,
		onReset,
	};
}
