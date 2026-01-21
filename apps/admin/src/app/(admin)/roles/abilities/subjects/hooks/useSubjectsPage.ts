"use client";

import {
	useGetSubjects,
	getGetSubjectsQueryKey,
} from "@cocrepo/api";
import type { Subject } from "@cocrepo/ui";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalObservable } from "mobx-react-lite";
import { runInAction } from "mobx";

/**
 * Subject 확장 타입 (isSystem 포함)
 */
export interface SubjectWithSystem extends Subject {
	/** 시스템 Subject 여부 */
	isSystem?: boolean;
}

/**
 * Subject 폼 데이터
 */
export interface SubjectFormData {
	/** 그룹 */
	group: string;
	/** Subject 이름 */
	name: string;
	/** 표시명 */
	displayName: string;
	/** 설명 */
	description?: string;
}

/**
 * 페이지 상태 타입
 */
interface SubjectsPageState {
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
 * SubjectsPage 훅
 *
 * Subject 관리 페이지에서 필요한 모든 상태와 핸들러를 제공합니다.
 */
export function useSubjectsPage() {
	const queryClient = useQueryClient();

	// =====================
	// Query 훅 - 최상위에서 호출
	// =====================

	// Subject 목록 조회
	const { data: subjectsResponse, isLoading } = useGetSubjects();

	// 로컬 상태
	const state = useLocalObservable<SubjectsPageState>(() => ({
		error: null,
		subjectFormModal: {
			isOpen: false,
			mode: "create",
			initialData: undefined,
		},
	}));

	// =====================
	// 데이터 변환
	// =====================

	/**
	 * Subject 목록 변환
	 */
	const subjects: SubjectWithSystem[] =
		subjectsResponse?.data?.map((subject) => ({
			id: subject.id,
			name: subject.name,
			displayName: subject.displayName ?? subject.name,
			group: subject.group,
			isSystem: subject.isSystem,
		})) ?? [];

	// =====================
	// Subject 관리 핸들러
	// =====================

	/**
	 * Subject 추가 버튼 클릭
	 */
	const onClickAddSubjectButton = () => {
		runInAction(() => {
			state.subjectFormModal = {
				isOpen: true,
				mode: "create",
				initialData: undefined,
			};
		});
	};

	/**
	 * Subject 수정 버튼 클릭
	 */
	const onClickEditSubjectButton = (subject: SubjectWithSystem) => {
		runInAction(() => {
			state.subjectFormModal = {
				isOpen: true,
				mode: "edit",
				initialData: subject,
			};
		});
	};

	/**
	 * Subject 모달 닫기
	 */
	const onCloseSubjectModal = () => {
		runInAction(() => {
			state.subjectFormModal = {
				isOpen: false,
				mode: "create",
				initialData: undefined,
			};
		});
	};

	/**
	 * Subject 추가 (내부 함수)
	 * TODO: Subject CRUD API가 추가되면 실제 API 호출로 교체
	 */
	const addSubject = async (data: SubjectFormData): Promise<void> => {
		try {
			// TODO: Subject 생성 API 호출로 교체
			// await createSubject.mutateAsync({ data: { ... } });
			console.log("Add subject:", data);

			// 캐시 무효화
			await queryClient.invalidateQueries({
				queryKey: getGetSubjectsQueryKey(),
			});

			onCloseSubjectModal();
		} catch (err) {
			runInAction(() => {
				state.error = err instanceof Error ? err.message : "Subject 추가 실패";
			});
			throw err;
		}
	};

	/**
	 * Subject 수정 (내부 함수)
	 * TODO: Subject CRUD API가 추가되면 실제 API 호출로 교체
	 */
	const updateSubject = async (
		subjectId: string,
		data: {
			displayName: string;
			description?: string;
		},
	): Promise<void> => {
		try {
			// TODO: Subject 수정 API 호출로 교체
			// await updateSubjectMutation.mutateAsync({ id: subjectId, data: { ... } });
			console.log("Update subject:", subjectId, data);

			// 캐시 무효화
			await queryClient.invalidateQueries({
				queryKey: getGetSubjectsQueryKey(),
			});

			onCloseSubjectModal();
		} catch (err) {
			runInAction(() => {
				state.error = err instanceof Error ? err.message : "Subject 수정 실패";
			});
			throw err;
		}
	};

	/**
	 * Subject 삭제 버튼 클릭
	 * TODO: Subject CRUD API가 추가되면 실제 API 호출로 교체
	 */
	const onClickDeleteSubjectButton = async (
		subjectId: string,
	): Promise<void> => {
		try {
			// TODO: Subject 삭제 API 호출로 교체
			// await deleteSubjectMutation.mutateAsync({ id: subjectId });
			console.log("Delete subject:", subjectId);

			// 캐시 무효화
			await queryClient.invalidateQueries({
				queryKey: getGetSubjectsQueryKey(),
			});
		} catch (err) {
			runInAction(() => {
				state.error = err instanceof Error ? err.message : "Subject 삭제 실패";
			});
			throw err;
		}
	};

	/**
	 * Subject 폼 모달 제출
	 */
	const onSubmitSubjectForm = async (data: SubjectFormData) => {
		if (state.subjectFormModal.mode === "create") {
			await addSubject(data);
		} else if (state.subjectFormModal.initialData) {
			await updateSubject(state.subjectFormModal.initialData.id, {
				displayName: data.displayName,
				description: data.description,
			});
		}
	};

	// =====================
	// 상태 객체 생성 (getter 패턴)
	// =====================

	const observableState = {
		get subjects() {
			return subjects;
		},
		get isLoading() {
			return isLoading;
		},
		get error() {
			return state.error;
		},
		get subjectFormModal() {
			return state.subjectFormModal;
		},
	};

	return {
		state: observableState,
		// Subject 관리 핸들러
		onClickAddSubjectButton,
		onClickEditSubjectButton,
		onCloseSubjectModal,
		onClickDeleteSubjectButton,
		onSubmitSubjectForm,
	};
}
