import type { ColumnConfig } from "@cocrepo/ui";
import { makeAutoObservable, runInAction } from "mobx";

export type ConfigScope = "GLOBAL" | "ROLE";

/**
 * UI 설정 관리 페이지 Store
 *
 * 테이블 컬럼의 표시/숨김, 순서, 너비를 관리
 */
export class UIConfigsPageStore {
	/** 설정 범위 (GLOBAL/ROLE) */
	scope: ConfigScope = "GLOBAL";

	/** 선택된 역할 ID (ROLE 범위일 때) */
	selectedRoleId: string | null = null;

	/** 선택된 엔티티 */
	selectedEntity = "User";

	/** 컬럼 설정 목록 */
	columns: ColumnConfig[] = [];

	/** 원본 컬럼 설정 (변경 감지용) */
	originalColumns: ColumnConfig[] = [];

	/** 로딩 상태 */
	isLoading = false;

	/** 저장 중 상태 */
	isSaving = false;

	/** 에러 메시지 */
	error: string | null = null;

	constructor() {
		makeAutoObservable(this);
	}

	/**
	 * 변경사항이 있는지 확인
	 */
	get isDirty(): boolean {
		return (
			JSON.stringify(this.columns) !== JSON.stringify(this.originalColumns)
		);
	}

	/**
	 * 범위 설정
	 */
	setScope(scope: ConfigScope) {
		runInAction(() => {
			this.scope = scope;
			if (scope === "GLOBAL") {
				this.selectedRoleId = null;
			}
		});
	}

	/**
	 * 역할 ID 설정
	 */
	setSelectedRoleId(roleId: string | null) {
		runInAction(() => {
			this.selectedRoleId = roleId;
		});
	}

	/**
	 * 엔티티 설정
	 */
	setSelectedEntity(entity: string) {
		runInAction(() => {
			this.selectedEntity = entity;
		});
	}

	/**
	 * 컬럼 목록 설정
	 */
	setColumns(columns: ColumnConfig[]) {
		runInAction(() => {
			this.columns = columns;
		});
	}

	/**
	 * 원본 컬럼 설정 (API 응답 데이터 저장)
	 */
	setOriginalColumns(columns: ColumnConfig[]) {
		runInAction(() => {
			this.originalColumns = columns;
			this.columns = columns.map((col) => ({ ...col }));
		});
	}

	/**
	 * 컬럼 업데이트
	 */
	updateColumn(id: string, updates: Partial<ColumnConfig>) {
		runInAction(() => {
			this.columns = this.columns.map((col) =>
				col.id === id ? { ...col, ...updates } : col,
			);
		});
	}

	/**
	 * 컬럼 순서 변경
	 */
	reorderColumns(fromIndex: number, toIndex: number) {
		runInAction(() => {
			const newColumns = [...this.columns];
			const [removed] = newColumns.splice(fromIndex, 1);
			newColumns.splice(toIndex, 0, removed);
			this.columns = newColumns.map((col, idx) => ({
				...col,
				sortOrder: idx + 1,
			}));
		});
	}

	/**
	 * 변경사항 초기화
	 */
	resetChanges() {
		runInAction(() => {
			this.columns = this.originalColumns.map((col) => ({ ...col }));
		});
	}

	/**
	 * 로딩 상태 설정
	 */
	setLoading(loading: boolean) {
		runInAction(() => {
			this.isLoading = loading;
		});
	}

	/**
	 * 저장 중 상태 설정
	 */
	setSaving(saving: boolean) {
		runInAction(() => {
			this.isSaving = saving;
		});
	}

	/**
	 * 에러 설정
	 */
	setError(error: string | null) {
		runInAction(() => {
			this.error = error;
		});
	}
}
