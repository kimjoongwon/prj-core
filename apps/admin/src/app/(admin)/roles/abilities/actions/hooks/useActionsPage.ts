"use client";

import {
	useGetActions,
	useCreateAction,
	useUpdateAction,
	useDeleteAction,
	getGetActionsQueryKey,
} from "@cocrepo/api";
import type { Action } from "@cocrepo/ui";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalObservable } from "mobx-react-lite";
import { runInAction } from "mobx";

/**
 * Action 폼 데이터
 */
export interface ActionFormData {
	/** Action 이름 */
	name: string;
	/** 표시명 */
	displayName: string;
	/** 그룹 */
	group: string;
	/** 설명 */
	description?: string;
}

/**
 * 페이지 상태 타입
 */
interface ActionsPageState {
	/** 에러 메시지 */
	error: string | null;
	/** Action 폼 모달 상태 */
	actionFormModal: {
		isOpen: boolean;
		mode: "create" | "edit";
		initialData?: Action;
	};
}

/**
 * ActionsPage 훅
 *
 * Action 관리 페이지에서 필요한 모든 상태와 핸들러를 제공합니다.
 */
export function useActionsPage() {
	const queryClient = useQueryClient();

	// =====================
	// Query 훅 - 최상위에서 호출
	// =====================

	// Action 목록 조회
	const { data: actionsResponse, isLoading } = useGetActions();

	// Mutation 훅
	const createAction = useCreateAction();
	const updateAction = useUpdateAction();
	const deleteAction = useDeleteAction();

	// 로컬 상태
	const state = useLocalObservable<ActionsPageState>(() => ({
		error: null,
		actionFormModal: {
			isOpen: false,
			mode: "create",
			initialData: undefined,
		},
	}));

	// =====================
	// 데이터 변환
	// =====================

	/**
	 * Action 목록 변환
	 */
	const actions: Action[] =
		actionsResponse?.data?.map((action) => ({
			id: action.id,
			name: action.name,
			displayName: action.displayName ?? action.name,
			group: action.group,
		})) ?? [];

	// =====================
	// Action 관리 핸들러
	// =====================

	/**
	 * Action 추가 버튼 클릭
	 */
	const onClickAddActionButton = () => {
		runInAction(() => {
			state.actionFormModal = {
				isOpen: true,
				mode: "create",
				initialData: undefined,
			};
		});
	};

	/**
	 * Action 수정 버튼 클릭
	 */
	const onClickEditActionButton = (action: Action) => {
		runInAction(() => {
			state.actionFormModal = {
				isOpen: true,
				mode: "edit",
				initialData: action,
			};
		});
	};

	/**
	 * Action 모달 닫기
	 */
	const onCloseActionModal = () => {
		runInAction(() => {
			state.actionFormModal = {
				isOpen: false,
				mode: "create",
				initialData: undefined,
			};
		});
	};

	/**
	 * Action 삭제 버튼 클릭
	 */
	const onClickDeleteActionButton = async (actionId: string): Promise<void> => {
		try {
			await deleteAction.mutateAsync({ id: actionId });

			// 캐시 무효화
			await queryClient.invalidateQueries({
				queryKey: getGetActionsQueryKey(),
			});
		} catch (err) {
			runInAction(() => {
				state.error = err instanceof Error ? err.message : "Action 삭제 실패";
			});
			throw err;
		}
	};

	/**
	 * Action 폼 모달 제출
	 */
	const onSubmitActionForm = async (data: ActionFormData): Promise<void> => {
		try {
			if (state.actionFormModal.mode === "create") {
				await createAction.mutateAsync({
					data: {
						name: data.name,
						displayName: data.displayName,
						group: data.group,
						description: data.description,
						order: 0,
						isSystem: false,
					},
				});
			} else if (state.actionFormModal.initialData) {
				await updateAction.mutateAsync({
					id: state.actionFormModal.initialData.id,
					data: {
						displayName: data.displayName,
						group: data.group,
						description: data.description,
					},
				});
			}

			// 캐시 무효화
			await queryClient.invalidateQueries({
				queryKey: getGetActionsQueryKey(),
			});

			onCloseActionModal();
		} catch (err) {
			runInAction(() => {
				state.error =
					err instanceof Error
						? err.message
						: state.actionFormModal.mode === "create"
							? "Action 추가 실패"
							: "Action 수정 실패";
			});
			throw err;
		}
	};

	// =====================
	// 상태 객체 생성 (getter 패턴)
	// =====================

	const observableState = {
		get actions() {
			return actions;
		},
		get isLoading() {
			return isLoading;
		},
		get error() {
			return state.error;
		},
		get actionFormModal() {
			return state.actionFormModal;
		},
	};

	return {
		state: observableState,
		onClickAddActionButton,
		onClickEditActionButton,
		onCloseActionModal,
		onClickDeleteActionButton,
		onSubmitActionForm,
	};
}
