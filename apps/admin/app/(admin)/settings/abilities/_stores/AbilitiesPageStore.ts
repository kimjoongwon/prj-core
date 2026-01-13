import type {
	AbilityResponseDto,
	CreateAbilityDto,
	Roles,
	SubjectResponseDto,
} from "@cocrepo/api";
import { makeAutoObservable, runInAction } from "mobx";

/**
 * 권한 관리 페이지 Store
 *
 * 역할별 권한 관리를 위한 상태 관리
 */
export class AbilitiesPageStore {
	/** 선택된 역할 */
	selectedRole: Roles = "USER";

	/** Subject 목록 */
	subjects: SubjectResponseDto[] = [];

	/** 현재 역할의 권한 목록 */
	abilities: AbilityResponseDto[] = [];

	/** 변경된 권한 맵 (subjectId-action -> 활성화 여부) */
	changedAbilities: Map<string, boolean> = new Map();

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
	 * 역할 선택
	 */
	setSelectedRole(role: Roles) {
		this.selectedRole = role;
		this.changedAbilities.clear();
	}

	/**
	 * Subject 목록 설정
	 */
	setSubjects(subjects: SubjectResponseDto[]) {
		this.subjects = subjects;
	}

	/**
	 * 권한 목록 설정
	 */
	setAbilities(abilities: AbilityResponseDto[]) {
		this.abilities = abilities;
		this.changedAbilities.clear();
	}

	/**
	 * 로딩 상태 설정
	 */
	setLoading(isLoading: boolean) {
		this.isLoading = isLoading;
	}

	/**
	 * 저장 중 상태 설정
	 */
	setSaving(isSaving: boolean) {
		this.isSaving = isSaving;
	}

	/**
	 * 에러 설정
	 */
	setError(error: string | null) {
		this.error = error;
	}

	/**
	 * Subject가 특정 액션에 대한 권한을 가지고 있는지 확인
	 */
	hasAbility(subjectId: string, action: string): boolean {
		const key = `${subjectId}-${action}`;

		// 변경된 권한이 있으면 그 값을 반환
		if (this.changedAbilities.has(key)) {
			return this.changedAbilities.get(key) ?? false;
		}

		// 기존 권한 확인
		return this.abilities.some(
			(ability) =>
				ability.subjectId === subjectId &&
				ability.action === action &&
				ability.type === "CAN" &&
				ability.isActive,
		);
	}

	/**
	 * 권한 토글
	 */
	toggleAbility(subjectId: string, action: string) {
		const key = `${subjectId}-${action}`;
		const currentValue = this.hasAbility(subjectId, action);
		runInAction(() => {
			this.changedAbilities.set(key, !currentValue);
		});
	}

	/**
	 * 변경사항이 있는지 확인
	 */
	get hasChanges(): boolean {
		return this.changedAbilities.size > 0;
	}

	/**
	 * 변경된 권한을 CreateAbilityDto 배열로 변환
	 */
	getChangedAbilitiesAsDto(): CreateAbilityDto[] {
		const result: CreateAbilityDto[] = [];

		// 기존 활성화된 권한 중 변경되지 않은 것들
		for (const ability of this.abilities) {
			const key = `${ability.subjectId}-${ability.action}`;
			if (
				!this.changedAbilities.has(key) &&
				ability.type === "CAN" &&
				ability.isActive
			) {
				result.push({
					type: "CAN",
					action: ability.action,
					subjectId: ability.subjectId,
					description:
						typeof ability.description === "string"
							? ability.description
							: undefined,
					conditions: ability.conditions ?? undefined,
					isActive: true,
				});
			}
		}

		// 변경된 권한들
		for (const [key, isEnabled] of this.changedAbilities) {
			if (isEnabled) {
				const [subjectId, action] = key.split("-");
				result.push({
					type: "CAN",
					action: action as CreateAbilityDto["action"],
					subjectId,
					isActive: true,
				});
			}
		}

		return result;
	}

	/**
	 * Subject 타입별 그룹화
	 */
	get subjectsByType(): Record<string, SubjectResponseDto[]> {
		const grouped: Record<string, SubjectResponseDto[]> = {
			Menu: [],
			Feature: [],
			Entity: [],
			API: [],
			Column: [],
		};

		for (const subject of this.subjects) {
			const type = subject.type ?? "Entity";
			if (grouped[type]) {
				grouped[type].push(subject);
			}
		}

		return grouped;
	}

	/**
	 * 변경사항 초기화
	 */
	resetChanges() {
		this.changedAbilities.clear();
	}
}
