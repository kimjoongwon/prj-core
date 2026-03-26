import { makeAutoObservable, runInAction } from "mobx";
import { useState } from "react";
import type { AbilityFormData } from "../../../form/AbilityFormModal";
import type { AbilityRule } from "../../../widget/ability/AbilityRuleList";
import type { RoleAbilityManagerProps } from "./type";

/**
 * 로컬 상태 관리 클래스
 * MobX observable로 폼 모달 및 Ability 목록 상태를 관리합니다.
 */
class RoleAbilityManagerState {
	/** Ability 규칙 목록 */
	abilities: AbilityRule[] = [];
	/** 로딩 상태 */
	isLoading = false;
	/** 에러 메시지 */
	error: string | null = null;
	/** 모달 열림 상태 */
	isModalOpen = false;
	/** 수정 중인 Ability의 ID */
	editingAbilityId: string | null = null;
	/** 수정 모드 시 초기 데이터 */
	editingInitialData: Partial<AbilityFormData> | undefined = undefined;
	/** 모달 모드 (생성/수정) */
	modalMode: "create" | "edit" = "create";
	/** 저장 중 상태 */
	isSaving = false;
	/** 선택된 Subject의 필드 목록 */
	subjectFields: string[] = [];
	/** Subject 필드 로딩 상태 */
	isLoadingSubjectFields = false;

	constructor() {
		makeAutoObservable(this);
	}

	/**
	 * 로딩 상태 설정
	 */
	setLoading(loading: boolean) {
		this.isLoading = loading;
	}

	/**
	 * Ability 목록 설정
	 */
	setAbilities(abilities: AbilityRule[]) {
		this.abilities = abilities;
	}

	/**
	 * 에러 설정
	 */
	setError(error: string | null) {
		this.error = error;
	}

	/**
	 * 모달 열기 (추가 모드)
	 */
	openAddModal() {
		this.editingAbilityId = null;
		this.editingInitialData = undefined;
		this.modalMode = "create";
		this.subjectFields = [];
		this.isModalOpen = true;
	}

	/**
	 * 모달 열기 (수정 모드)
	 */
	openEditModal(rule: AbilityRule) {
		// AbilityRule을 AbilityFormData로 변환
		this.editingAbilityId = rule.id;
		this.editingInitialData = {
			name: rule.name,
			subjectId: rule.subjectName, // Subject name을 ID로 사용 (실제로는 ID를 전달받아야 함)
			subjectName: rule.subjectName,
			actionId: rule.actionName, // Action name을 ID로 사용 (실제로는 ID를 전달받아야 함)
			actionName: rule.actionName,
			fields: rule.fields,
			conditions: rule.conditions ?? null,
			inverted: rule.inverted,
			isActive: rule.isActive,
			priority: rule.priority,
		};
		this.modalMode = "edit";
		this.isModalOpen = true;
	}

	/**
	 * 모달 닫기
	 */
	closeModal() {
		this.isModalOpen = false;
		this.editingAbilityId = null;
		this.editingInitialData = undefined;
		this.subjectFields = [];
	}

	/**
	 * 저장 상태 설정
	 */
	setSaving(saving: boolean) {
		this.isSaving = saving;
	}

	/**
	 * Subject 필드 설정
	 */
	setSubjectFields(fields: string[]) {
		this.subjectFields = fields;
	}

	/**
	 * Subject 필드 로딩 상태 설정
	 */
	setLoadingSubjectFields(loading: boolean) {
		this.isLoadingSubjectFields = loading;
	}
}

interface UseRoleAbilityManagerParams {
	selectedRoleId?: string;
	onLoadAbilities: RoleAbilityManagerProps["onLoadAbilities"];
	onAddAbility: RoleAbilityManagerProps["onAddAbility"];
	onUpdateAbility: RoleAbilityManagerProps["onUpdateAbility"];
	onDeleteAbility: RoleAbilityManagerProps["onDeleteAbility"];
	onToggleActive: RoleAbilityManagerProps["onToggleActive"];
	onLoadSubjectFields?: RoleAbilityManagerProps["onLoadSubjectFields"];
	subjects: RoleAbilityManagerProps["subjects"];
}

/**
 * RoleAbilityManager 커스텀 훅
 *
 * Ability 목록 로딩, CRUD 작업, 모달 상태 관리를 담당합니다.
 */
export function useRoleAbilityManager({
	selectedRoleId,
	onLoadAbilities,
	onAddAbility,
	onUpdateAbility,
	onDeleteAbility,
	onToggleActive,
	onLoadSubjectFields,
	subjects,
}: UseRoleAbilityManagerParams) {
	// MobX 로컬 상태 (컴포넌트별 인스턴스)
	const [state] = useState(() => new RoleAbilityManagerState());

	/**
	 * Ability 목록 로드
	 */
	const loadAbilities = async (roleId: string) => {
		state.setLoading(true);
		state.setError(null);

		try {
			const abilities = await onLoadAbilities(roleId);
			runInAction(() => {
				state.setAbilities(abilities);
			});
		} catch (err) {
			runInAction(() => {
				state.setError(
					err instanceof Error
						? err.message
						: "권한 목록을 불러오는데 실패했습니다",
				);
			});
		} finally {
			runInAction(() => {
				state.setLoading(false);
			});
		}
	};

	/**
	 * Subject 필드 로드
	 */
	const loadSubjectFields = async (subjectId: string) => {
		if (!onLoadSubjectFields) {
			runInAction(() => {
				state.setSubjectFields([]);
			});
			return;
		}

		const selectedSubject = subjects.find((s) => s.id === subjectId);
		if (!selectedSubject) {
			runInAction(() => {
				state.setSubjectFields([]);
			});
			return;
		}

		state.setLoadingSubjectFields(true);
		try {
			const fields = await onLoadSubjectFields(selectedSubject.name);
			runInAction(() => {
				state.setSubjectFields(fields);
			});
		} catch {
			runInAction(() => {
				state.setSubjectFields([]);
			});
		} finally {
			runInAction(() => {
				state.setLoadingSubjectFields(false);
			});
		}
	};

	/**
	 * Ability 저장 (폼 제출 핸들러)
	 */
	const handleSubmitAbility = async (data: AbilityFormData) => {
		if (!selectedRoleId) return;

		state.setSaving(true);

		try {
			if (state.editingAbilityId) {
				// 수정 모드
				await onUpdateAbility(state.editingAbilityId, data);
			} else {
				// 추가 모드
				await onAddAbility(selectedRoleId, data);
			}

			// 저장 성공 시 모달 닫고 목록 새로고침
			runInAction(() => {
				state.closeModal();
			});
			await loadAbilities(selectedRoleId);
		} catch (err) {
			runInAction(() => {
				state.setError(
					err instanceof Error ? err.message : "저장에 실패했습니다",
				);
			});
		} finally {
			runInAction(() => {
				state.setSaving(false);
			});
		}
	};

	/**
	 * Ability 삭제
	 */
	const handleDeleteAbility = async (abilityId: string) => {
		if (!selectedRoleId) return;

		try {
			await onDeleteAbility(abilityId);
			await loadAbilities(selectedRoleId);
		} catch (err) {
			runInAction(() => {
				state.setError(
					err instanceof Error ? err.message : "삭제에 실패했습니다",
				);
			});
		}
	};

	/**
	 * Ability 활성화 상태 토글
	 */
	const handleToggleActive = async (abilityId: string, isActive: boolean) => {
		if (!selectedRoleId) return;

		try {
			await onToggleActive(abilityId, isActive);
			await loadAbilities(selectedRoleId);
		} catch (err) {
			runInAction(() => {
				state.setError(
					err instanceof Error ? err.message : "상태 변경에 실패했습니다",
				);
			});
		}
	};

	/**
	 * 추가 모달 열기
	 */
	const handleOpenAddModal = () => {
		state.openAddModal();
	};

	/**
	 * 수정 모달 열기
	 */
	const handleOpenEditModal = (rule: AbilityRule) => {
		state.openEditModal(rule);
	};

	/**
	 * 모달 닫기
	 */
	const handleCloseModal = () => {
		state.closeModal();
	};

	return {
		// 상태
		state,
		// 데이터 로딩
		loadAbilities,
		loadSubjectFields,
		// CRUD 핸들러
		handleSubmitAbility,
		handleDeleteAbility,
		handleToggleActive,
		// 모달 핸들러
		handleOpenAddModal,
		handleOpenEditModal,
		handleCloseModal,
	};
}
