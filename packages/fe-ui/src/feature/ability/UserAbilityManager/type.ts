import type {
	AbilityFormData,
	Action,
	Subject,
} from "../../../form/AbilityFormModal";
import type { AbilityRule } from "../../../widget/ability/AbilityRuleList";

/**
 * Ability 관리용 사용자 정보 타입
 */
export interface AbilityUser {
	/** 사용자 고유 ID */
	id: string;
	/** 사용자 이름 */
	name: string;
	/** 이메일 주소 */
	email: string;
	/** 역할(Role) 이름 */
	roleName?: string;
	/** 역할 표시명 */
	roleDisplayName?: string;
}

/**
 * UserAbilityManager Props
 */
export interface UserAbilityManagerProps {
	/** 사용자 검색 함수 */
	onSearchUsers: (query: string) => Promise<AbilityUser[]>;
	/** 선택된 사용자 (외부 제어용) */
	selectedUser?: AbilityUser;
	/** 사용자 선택 콜백 (외부 제어용) */
	onUserSelect?: (user: AbilityUser | null) => void;
	/** Ability 규칙 로드 함수 */
	onLoadAbilities: (userId: string) => Promise<AbilityRule[]>;
	/** Ability 추가 함수 */
	onAddAbility: (userId: string, data: AbilityFormData) => Promise<void>;
	/** Ability 수정 함수 */
	onUpdateAbility: (abilityId: string, data: AbilityFormData) => Promise<void>;
	/** Ability 삭제 함수 */
	onDeleteAbility: (abilityId: string) => Promise<void>;
	/** 활성화 토글 함수 */
	onToggleActive: (abilityId: string, isActive: boolean) => Promise<void>;
	/** Subject 목록 (폼용) */
	subjects: Subject[];
	/** Action 목록 (폼용) */
	actions: Action[];
	/** Subject 필드 로드 함수 */
	onLoadSubjectFields?: (subjectName: string) => Promise<string[]>;
}

/**
 * 폼 모달 모드
 */
export type FormMode = "add" | "edit" | null;

// 위젯 타입 재export
export type { AbilityFormData, AbilityRule, Action, Subject };
