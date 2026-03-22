import { useEffect, useRef, useState } from "react";
import type { AbilityRule } from "../../../widget/ability/AbilityRuleList";
import type { AbilityFormData } from "../../../widget/form/AbilityFormModal";
import type { AbilityUser, FormMode, UserAbilityManagerProps } from "./type";

type UseUserAbilityManagerParams = Pick<
	UserAbilityManagerProps,
	| "selectedUser"
	| "onUserSelect"
	| "onSearchUsers"
	| "onLoadAbilities"
	| "onAddAbility"
	| "onUpdateAbility"
	| "onDeleteAbility"
	| "onToggleActive"
	| "onLoadSubjectFields"
>;

/**
 * UserAbilityManager의 상태
 */
export interface UserAbilityManagerState {
	/** 로딩 중 여부 */
	isLoading: boolean;
	/** 저장 중 여부 */
	isSaving: boolean;
	/** 에러 메시지 */
	error: string | null;
	/** Ability 목록 */
	abilities: AbilityRule[];
	/** 모달 열림 상태 */
	isModalOpen: boolean;
	/** 수정 중인 Ability */
	editingAbility: Partial<AbilityFormData> | undefined;
	/** 폼 모드 */
	formMode: FormMode;
	/** 선택된 Subject의 필드 목록 */
	subjectFields: string[];
}

/**
 * UserAbilityManager 커스텀 훅
 *
 * 사용자 검색, 예외 권한 로드/추가/수정/삭제 로직을 분리합니다.
 */
export function useUserAbilityManager({
	selectedUser: externalSelectedUser,
	onUserSelect,
	onSearchUsers,
	onLoadAbilities,
	onAddAbility,
	onUpdateAbility,
	onDeleteAbility,
	onToggleActive,
	onLoadSubjectFields,
}: UseUserAbilityManagerParams) {
	// 내부 선택된 사용자 상태 (외부 제어가 없을 때 사용)
	const [internalSelectedUser, setInternalSelectedUser] =
		useState<AbilityUser | null>(null);
	// 외부 제어 여부에 따라 사용할 상태 결정
	const selectedUser = externalSelectedUser ?? internalSelectedUser;

	// 검색 관련 상태
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState<AbilityUser[]>([]);
	const [isSearching, setIsSearching] = useState(false);

	// 상태 관리
	const [state, setState] = useState<UserAbilityManagerState>({
		isLoading: false,
		isSaving: false,
		error: null,
		abilities: [],
		isModalOpen: false,
		editingAbility: undefined,
		formMode: null,
		subjectFields: [],
	});

	// 디바운스용 타이머 ref
	const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	/**
	 * 사용자 검색 핸들러 (디바운스 적용)
	 */
	const handleSearchQueryChange = (query: string) => {
		setSearchQuery(query);

		// 기존 타이머 취소
		if (searchTimerRef.current) {
			clearTimeout(searchTimerRef.current);
		}

		// 빈 검색어면 결과 초기화
		if (!query.trim()) {
			setSearchResults([]);
			return;
		}

		// 300ms 디바운스
		searchTimerRef.current = setTimeout(async () => {
			setIsSearching(true);
			try {
				const results = await onSearchUsers(query);
				setSearchResults(results);
			} catch (error) {
				console.error("사용자 검색 실패:", error);
				setSearchResults([]);
			} finally {
				setIsSearching(false);
			}
		}, 300);
	};

	/**
	 * 사용자 선택 핸들러
	 */
	const handleUserSelect = (user: AbilityUser | null) => {
		// 외부 제어가 있으면 외부 콜백 호출
		if (onUserSelect) {
			onUserSelect(user);
		} else {
			setInternalSelectedUser(user);
		}

		// 검색 상태 초기화
		setSearchQuery("");
		setSearchResults([]);
	};

	/**
	 * 선택된 사용자의 Ability 목록 로드
	 */
	const loadAbilities = async (userId: string) => {
		setState((prev) => ({ ...prev, isLoading: true, error: null }));
		try {
			const result = await onLoadAbilities(userId);
			setState((prev) => ({
				...prev,
				abilities: result,
				isLoading: false,
			}));
		} catch (error) {
			console.error("권한 목록 로드 실패:", error);
			setState((prev) => ({
				...prev,
				abilities: [],
				isLoading: false,
				error: "권한 목록을 불러오는 데 실패했습니다.",
			}));
		}
	};

	// 사용자 선택 시 Ability 목록 로드
	useEffect(() => {
		if (selectedUser) {
			loadAbilities(selectedUser.id);
		} else {
			setState((prev) => ({ ...prev, abilities: [] }));
		}
	}, [selectedUser?.id]);

	/**
	 * Subject 변경 시 필드 목록 로드
	 */
	const loadSubjectFields = async (subjectName: string) => {
		if (!onLoadSubjectFields || !subjectName) {
			setState((prev) => ({ ...prev, subjectFields: [] }));
			return;
		}

		try {
			const fields = await onLoadSubjectFields(subjectName);
			setState((prev) => ({ ...prev, subjectFields: fields }));
		} catch (error) {
			console.error("Subject 필드 로드 실패:", error);
			setState((prev) => ({ ...prev, subjectFields: [] }));
		}
	};

	/**
	 * 규칙 추가 모달 열기
	 */
	const handleOpenAddModal = () => {
		setState((prev) => ({
			...prev,
			isModalOpen: true,
			formMode: "add",
			editingAbility: {
				fields: [],
				inverted: false,
				isActive: true,
				priority: prev.abilities.length + 1,
			},
			subjectFields: [],
		}));
	};

	/**
	 * 규칙 수정 모달 열기
	 */
	const handleOpenEditModal = (rule: AbilityRule) => {
		setState((prev) => ({
			...prev,
			isModalOpen: true,
			formMode: "edit",
			editingAbility: {
				name: rule.name,
				subjectName: rule.subjectName,
				actionName: rule.actionName,
				inverted: rule.inverted,
				fields: rule.fields,
				conditions: rule.conditions,
				isActive: rule.isActive,
				priority: rule.priority,
			},
		}));

		// Subject 필드 로드
		if (rule.subjectName) {
			loadSubjectFields(rule.subjectName);
		}
	};

	/**
	 * 모달 닫기
	 */
	const handleCloseModal = () => {
		setState((prev) => ({
			...prev,
			isModalOpen: false,
			formMode: null,
			editingAbility: undefined,
			subjectFields: [],
		}));
	};

	/**
	 * 폼 저장 핸들러 (AbilityFormModal용)
	 */
	const handleSaveAbility = async (data: AbilityFormData) => {
		if (!selectedUser) return;

		setState((prev) => ({ ...prev, isSaving: true, error: null }));
		try {
			if (state.formMode === "add") {
				await onAddAbility(selectedUser.id, data);
			} else if (state.formMode === "edit" && state.editingAbility) {
				// 수정 시에는 기존 Ability ID가 필요 - AbilityRule에서 가져옴
				const existingAbility = state.abilities.find(
					(a) =>
						a.subjectName === state.editingAbility?.subjectName &&
						a.actionName === state.editingAbility?.actionName,
				);
				if (existingAbility) {
					await onUpdateAbility(existingAbility.id, data);
				}
			}

			// 목록 새로고침
			await loadAbilities(selectedUser.id);
			handleCloseModal();
		} catch (error) {
			console.error("권한 저장 실패:", error);
			setState((prev) => ({
				...prev,
				error: "권한 저장에 실패했습니다.",
			}));
		} finally {
			setState((prev) => ({ ...prev, isSaving: false }));
		}
	};

	/**
	 * 규칙 삭제 핸들러
	 */
	const handleDeleteAbility = async (ruleId: string) => {
		if (!selectedUser) return;

		try {
			await onDeleteAbility(ruleId);
			await loadAbilities(selectedUser.id);
		} catch (error) {
			console.error("권한 삭제 실패:", error);
			setState((prev) => ({
				...prev,
				error: "권한 삭제에 실패했습니다.",
			}));
		}
	};

	/**
	 * 활성화 토글 핸들러
	 */
	const handleToggleActive = async (ruleId: string, isActive: boolean) => {
		if (!selectedUser) return;

		try {
			await onToggleActive(ruleId, isActive);
			await loadAbilities(selectedUser.id);
		} catch (error) {
			console.error("활성화 상태 변경 실패:", error);
			setState((prev) => ({
				...prev,
				error: "활성화 상태 변경에 실패했습니다.",
			}));
		}
	};

	// 컴포넌트 언마운트 시 타이머 정리
	useEffect(() => {
		return () => {
			if (searchTimerRef.current) {
				clearTimeout(searchTimerRef.current);
			}
		};
	}, []);

	return {
		// 검색 상태
		searchQuery,
		searchResults,
		isSearching,
		handleSearchQueryChange,

		// 사용자 상태
		selectedUser,
		handleUserSelect,

		// 상태
		state,

		// Ability 로드
		loadAbilities,
		loadSubjectFields,

		// 모달 핸들러
		handleOpenAddModal,
		handleOpenEditModal,
		handleCloseModal,

		// CRUD 핸들러
		handleSaveAbility,
		handleDeleteAbility,
		handleToggleActive,
	};
}
