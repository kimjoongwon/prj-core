import type {
	AbilityFormData,
	Action,
	Subject,
} from "../../form/AbilityFormModal";
import type { AbilityRule } from "../../widget/AbilityRuleList";

/**
 * Role 정보
 */
export interface Role {
	/** Role ID */
	id: string;
	/** Role 식별자 */
	name: string;
	/** Role 표시명 */
	displayName?: string;
}

/**
 * RoleAbilityManager Props
 */
export interface RoleAbilityManagerProps {
	/** Role 목록 */
	roles: Role[];
	/** 선택된 Role ID */
	selectedRoleId?: string;
	/** Role 변경 핸들러 */
	onRoleChange?: (roleId: string) => void;
	/** Ability 목록 로드 핸들러 */
	onLoadAbilities: (roleId: string) => Promise<AbilityRule[]>;
	/** Ability 추가 핸들러 */
	onAddAbility: (roleId: string, data: AbilityFormData) => Promise<void>;
	/** Ability 수정 핸들러 */
	onUpdateAbility: (abilityId: string, data: AbilityFormData) => Promise<void>;
	/** Ability 삭제 핸들러 */
	onDeleteAbility: (abilityId: string) => Promise<void>;
	/** Ability 활성화 상태 토글 핸들러 */
	onToggleActive: (abilityId: string, isActive: boolean) => Promise<void>;
	/** Subject 목록 (폼용) */
	subjects: Subject[];
	/** Action 목록 (폼용) */
	actions: Action[];
	/** Subject 필드 로드 핸들러 (조건 편집기용) */
	onLoadSubjectFields?: (subjectName: string) => Promise<string[]>;
}

// 위젯 타입 재export
export type { AbilityFormData, AbilityRule, Action, Subject };
