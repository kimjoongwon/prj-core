"use client";

import type { Role, Subject } from "@cocrepo/ui";
import { runInAction } from "mobx";
import { useLocalObservable } from "mobx-react-lite";

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
 * UI 가시성 페이지 훅 (TODO: API 구현 후 활성화)
 *
 * Role별 UI 요소(ui:xxx Subject) 가시성 관리를 위한 상태와 핸들러를 제공합니다.
 */
export function useUIElementsPage() {
	// 로컬 상태
	const state = useLocalObservable<UIElementsPageState>(() => ({
		error: null,
		isDirty: false,
		changes: [],
	}));

	// =====================
	// 데이터 변환 (TODO: API 연동 후 실제 데이터로 교체)
	// =====================

	const roles: Role[] = [];
	const subjects: SubjectWithSystem[] = [];
	const isLoading = false;

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
	 */
	const onSave = async () => {
		// TODO: API 구현 후 활성화
		console.log("Save changes:", state.changes);
		runInAction(() => {
			state.isDirty = false;
			state.changes = [];
		});
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
