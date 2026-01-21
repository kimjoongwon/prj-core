"use client";

import type {
	AbilityFormData,
	AbilityRule,
	AbilityUser,
	Action,
	Role,
	Subject,
} from "@cocrepo/ui";
import { useLocalObservable } from "mobx-react-lite";

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
interface AbilitiesPageState {
	/** 현재 선택된 탭 */
	activeTab: "role" | "user" | "action" | "subject" | "ui-visibility";
	/** Role 목록 */
	roles: Role[];
	/** 선택된 Role ID */
	selectedRoleId: string | null;
	/** Subject 목록 */
	subjects: SubjectWithSystem[];
	/** Action 목록 */
	actions: Action[];
	/** 로딩 상태 */
	isLoading: boolean;
	/** 에러 메시지 */
	error: string | null;
	/** Subject 폼 모달 상태 */
	subjectFormModal: {
		isOpen: boolean;
		mode: "create" | "edit";
		initialData?: SubjectWithSystem;
	};
}

/**
 * AbilitiesPage 훅
 *
 * 권한 관리 페이지에서 필요한 모든 상태와 핸들러를 제공합니다.
 * - Role/User/Action 3개 탭 관리
 * - API 호출 및 상태 관리
 */
export function useAbilitiesPage() {
	const state = useLocalObservable<AbilitiesPageState>(() => ({
		activeTab: "role",
		roles: [],
		selectedRoleId: null,
		subjects: [],
		actions: [],
		isLoading: false,
		error: null,
		subjectFormModal: {
			isOpen: false,
			mode: "create",
			initialData: undefined,
		},
	}));

	// =====================
	// 초기 데이터 로드
	// =====================

	/**
	 * 페이지 초기화 - Role, Subject, Action 목록 로드
	 */
	const initialize = async () => {
		state.isLoading = true;
		state.error = null;

		try {
			// TODO: 실제 API 호출로 교체
			// 더미 데이터
			state.roles = [
				{ id: "role-1", name: "SUPER_ADMIN", displayName: "슈퍼 관리자" },
				{ id: "role-2", name: "ADMIN", displayName: "관리자" },
				{ id: "role-3", name: "MANAGER", displayName: "매니저" },
				{ id: "role-4", name: "STAFF", displayName: "스태프" },
				{ id: "role-5", name: "MEMBER", displayName: "회원" },
			];

			state.subjects = [
				{
					id: "subj-1",
					name: "entity:User",
					displayName: "사용자",
					group: "entity",
					isSystem: true,
				},
				{
					id: "subj-2",
					name: "entity:Reservation",
					displayName: "예약",
					group: "entity",
					isSystem: true,
				},
				{
					id: "subj-3",
					name: "entity:Payment",
					displayName: "결제",
					group: "entity",
					isSystem: true,
				},
				{
					id: "subj-4",
					name: "menu:dashboard",
					displayName: "대시보드",
					group: "menu",
					isSystem: true,
				},
				{
					id: "subj-5",
					name: "menu:settings",
					displayName: "설정",
					group: "menu",
					isSystem: true,
				},
				{
					id: "subj-6",
					name: "feature:export",
					displayName: "내보내기",
					group: "feature",
					isSystem: true,
				},
				{
					id: "subj-7",
					name: "ui:mobile-bottom-tab",
					displayName: "모바일 바텀탭",
					group: "ui",
					isSystem: true,
				},
				{
					id: "subj-8",
					name: "ui:mobile-bottom-tab:home",
					displayName: "바텀탭 - 홈",
					group: "ui",
					isSystem: true,
				},
				{
					id: "subj-9",
					name: "ui:main-banner",
					displayName: "메인 배너",
					group: "ui",
					isSystem: false,
				},
				{
					id: "subj-10",
					name: "ui:floating-button:chat",
					displayName: "플로팅 채팅 버튼",
					group: "ui",
					isSystem: false,
				},
			];

			state.actions = [
				{ id: "act-1", name: "create", displayName: "생성", group: "crud" },
				{ id: "act-2", name: "read", displayName: "조회", group: "crud" },
				{ id: "act-3", name: "update", displayName: "수정", group: "crud" },
				{ id: "act-4", name: "delete", displayName: "삭제", group: "crud" },
				{
					id: "act-5",
					name: "manage",
					displayName: "전체 관리",
					group: "crud",
				},
				{
					id: "act-6",
					name: "read:full",
					displayName: "전체 조회",
					group: "visibility",
				},
				{
					id: "act-7",
					name: "read:hidden",
					displayName: "숨김",
					group: "visibility",
				},
				{
					id: "act-8",
					name: "read:masked:email",
					displayName: "이메일 마스킹",
					group: "visibility",
				},
				{
					id: "act-9",
					name: "read:masked:phone",
					displayName: "전화번호 마스킹",
					group: "visibility",
				},
				{
					id: "act-10",
					name: "access",
					displayName: "접근",
					group: "workflow",
				},
				{
					id: "act-11",
					name: "export",
					displayName: "내보내기",
					group: "bulk",
				},
			];
		} catch (err) {
			state.error = err instanceof Error ? err.message : "데이터 로드 실패";
		} finally {
			state.isLoading = false;
		}
	};

	// =====================
	// 탭 관리
	// =====================

	/**
	 * 탭 변경 핸들러
	 */
	const handleTabChange = (
		tab: "role" | "user" | "action" | "subject" | "ui-visibility",
	) => {
		state.activeTab = tab;
	};

	// =====================
	// Role 권한 관리 핸들러
	// =====================

	/**
	 * Role 변경 핸들러
	 */
	const handleRoleChange = (roleId: string) => {
		state.selectedRoleId = roleId;
	};

	/**
	 * Role별 Ability 로드
	 */
	const handleLoadRoleAbilities = async (
		roleId: string,
	): Promise<AbilityRule[]> => {
		// TODO: 실제 API 호출로 교체
		console.log("Load abilities for role:", roleId);

		// 더미 데이터 반환
		return [
			{
				id: "ability-1",
				name: "사용자 전체 관리",
				subjectName: "entity:User",
				subjectDisplayName: "사용자",
				actionName: "manage",
				actionDisplayName: "전체 관리",
				inverted: false,
				fields: [],
				isActive: true,
				priority: 100,
			},
			{
				id: "ability-2",
				name: "예약 조회",
				subjectName: "entity:Reservation",
				subjectDisplayName: "예약",
				actionName: "read",
				actionDisplayName: "조회",
				inverted: false,
				fields: ["id", "status", "date"],
				conditions: { departmentId: "${user.departmentId}" },
				isActive: true,
				priority: 50,
			},
		];
	};

	/**
	 * Role Ability 추가
	 */
	const handleAddRoleAbility = async (
		roleId: string,
		data: AbilityFormData,
	): Promise<void> => {
		// TODO: 실제 API 호출로 교체
		console.log("Add ability for role:", roleId, data);
	};

	/**
	 * Role Ability 수정
	 */
	const handleUpdateRoleAbility = async (
		abilityId: string,
		data: AbilityFormData,
	): Promise<void> => {
		// TODO: 실제 API 호출로 교체
		console.log("Update ability:", abilityId, data);
	};

	/**
	 * Role Ability 삭제
	 */
	const handleDeleteRoleAbility = async (abilityId: string): Promise<void> => {
		// TODO: 실제 API 호출로 교체
		console.log("Delete ability:", abilityId);
	};

	/**
	 * Role Ability 활성화 토글
	 */
	const handleToggleRoleAbilityActive = async (
		abilityId: string,
		isActive: boolean,
	): Promise<void> => {
		// TODO: 실제 API 호출로 교체
		console.log("Toggle ability active:", abilityId, isActive);
	};

	// =====================
	// User 예외 권한 관리 핸들러
	// =====================

	/**
	 * 사용자 검색
	 */
	const handleSearchUsers = async (query: string): Promise<AbilityUser[]> => {
		// TODO: 실제 API 호출로 교체
		console.log("Search users:", query);

		if (!query || query.length < 2) {
			return [];
		}

		// 더미 데이터 반환
		return [
			{
				id: "user-1",
				name: "홍길동",
				email: "hong@example.com",
				roleName: "ADMIN",
				roleDisplayName: "관리자",
			},
			{
				id: "user-2",
				name: "김철수",
				email: "kim@example.com",
				roleName: "MANAGER",
				roleDisplayName: "매니저",
			},
		].filter(
			(u) =>
				u.name.includes(query) ||
				u.email.toLowerCase().includes(query.toLowerCase()),
		);
	};

	/**
	 * User별 Ability 로드
	 */
	const handleLoadUserAbilities = async (
		userId: string,
	): Promise<AbilityRule[]> => {
		// TODO: 실제 API 호출로 교체
		console.log("Load abilities for user:", userId);

		// 더미 데이터 반환
		return [];
	};

	/**
	 * User Ability 추가
	 */
	const handleAddUserAbility = async (
		userId: string,
		data: AbilityFormData,
	): Promise<void> => {
		// TODO: 실제 API 호출로 교체
		console.log("Add ability for user:", userId, data);
	};

	/**
	 * User Ability 수정
	 */
	const handleUpdateUserAbility = async (
		abilityId: string,
		data: AbilityFormData,
	): Promise<void> => {
		// TODO: 실제 API 호출로 교체
		console.log("Update user ability:", abilityId, data);
	};

	/**
	 * User Ability 삭제
	 */
	const handleDeleteUserAbility = async (abilityId: string): Promise<void> => {
		// TODO: 실제 API 호출로 교체
		console.log("Delete user ability:", abilityId);
	};

	/**
	 * User Ability 활성화 토글
	 */
	const handleToggleUserAbilityActive = async (
		abilityId: string,
		isActive: boolean,
	): Promise<void> => {
		// TODO: 실제 API 호출로 교체
		console.log("Toggle user ability active:", abilityId, isActive);
	};

	// =====================
	// 공통 핸들러
	// =====================

	/**
	 * Subject 필드 로드 (DMMF 기반)
	 */
	const handleLoadSubjectFields = async (
		subjectName: string,
	): Promise<string[]> => {
		// TODO: 실제 API 호출로 교체
		console.log("Load fields for subject:", subjectName);

		// entity: 패턴인 경우 더미 필드 반환
		if (subjectName.startsWith("entity:")) {
			const entityName = subjectName.replace("entity:", "");
			switch (entityName) {
				case "User":
					return ["id", "name", "email", "phone", "createdAt", "updatedAt"];
				case "Reservation":
					return [
						"id",
						"userId",
						"date",
						"status",
						"departmentId",
						"createdAt",
					];
				case "Payment":
					return ["id", "amount", "status", "cardNumber", "createdAt"];
				default:
					return ["id", "createdAt", "updatedAt"];
			}
		}

		return [];
	};

	// =====================
	// Subject 관리 핸들러
	// =====================

	/**
	 * Subject 추가 모달 열기
	 */
	const handleOpenAddSubjectModal = () => {
		state.subjectFormModal = {
			isOpen: true,
			mode: "create",
			initialData: undefined,
		};
	};

	/**
	 * Subject 수정 모달 열기
	 */
	const handleOpenEditSubjectModal = (subject: SubjectWithSystem) => {
		state.subjectFormModal = {
			isOpen: true,
			mode: "edit",
			initialData: subject,
		};
	};

	/**
	 * Subject 모달 닫기
	 */
	const handleCloseSubjectModal = () => {
		state.subjectFormModal = {
			isOpen: false,
			mode: "create",
			initialData: undefined,
		};
	};

	/**
	 * Subject 추가 제출
	 */
	const handleAddSubject = async (data: {
		group: string;
		name: string;
		displayName: string;
		description?: string;
	}): Promise<void> => {
		// TODO: 실제 API 호출로 교체
		console.log("Add subject:", data);

		// 더미: 로컬 상태에 추가
		const newSubject: SubjectWithSystem = {
			id: `subj-${Date.now()}`,
			name: data.name,
			displayName: data.displayName,
			group: data.group,
			isSystem: false,
		};
		state.subjects.push(newSubject);
		handleCloseSubjectModal();
	};

	/**
	 * Subject 수정 제출
	 */
	const handleUpdateSubject = async (
		subjectId: string,
		data: {
			displayName: string;
			description?: string;
		},
	): Promise<void> => {
		// TODO: 실제 API 호출로 교체
		console.log("Update subject:", subjectId, data);

		// 더미: 로컬 상태 업데이트
		const subject = state.subjects.find((s) => s.id === subjectId);
		if (subject) {
			subject.displayName = data.displayName;
		}
		handleCloseSubjectModal();
	};

	/**
	 * Subject 삭제
	 */
	const handleDeleteSubject = async (subjectId: string): Promise<void> => {
		// TODO: 실제 API 호출로 교체
		console.log("Delete subject:", subjectId);

		// 더미: 로컬 상태에서 제거
		const index = state.subjects.findIndex((s) => s.id === subjectId);
		if (index !== -1) {
			state.subjects.splice(index, 1);
		}
	};

	return {
		state,
		initialize,
		handleTabChange,
		// Role 핸들러
		handleRoleChange,
		handleLoadRoleAbilities,
		handleAddRoleAbility,
		handleUpdateRoleAbility,
		handleDeleteRoleAbility,
		handleToggleRoleAbilityActive,
		// User 핸들러
		handleSearchUsers,
		handleLoadUserAbilities,
		handleAddUserAbility,
		handleUpdateUserAbility,
		handleDeleteUserAbility,
		handleToggleUserAbilityActive,
		// 공통 핸들러
		handleLoadSubjectFields,
		// Subject 관리 핸들러
		handleOpenAddSubjectModal,
		handleOpenEditSubjectModal,
		handleCloseSubjectModal,
		handleAddSubject,
		handleUpdateSubject,
		handleDeleteSubject,
	};
}
