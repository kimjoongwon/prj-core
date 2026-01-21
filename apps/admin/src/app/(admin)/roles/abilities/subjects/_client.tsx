"use client";

import { PageSurface, SectionSurface } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import { SubjectFormModal } from "../components/SubjectFormModal";
import { SubjectManagementTab } from "../components/SubjectManagementTab";
import { useSubjectsPage } from "./hooks";

/**
 * Subject 관리 페이지 클라이언트 컴포넌트
 *
 * 권한에서 사용할 Subject를 관리합니다.
 * - Subject 목록 조회 (그룹별 필터링)
 * - Subject 추가/수정/삭제
 * - 시스템 Subject는 Prisma 스키마에서 자동 생성되어 수정/삭제 불가
 */
function SubjectsPageClient() {
	const {
		state,
		onClickAddSubjectButton,
		onClickEditSubjectButton,
		onCloseSubjectModal,
		onClickDeleteSubjectButton,
		onSubmitSubjectForm,
	} = useSubjectsPage();

	return (
		<PageSurface
			title="Subject 관리"
			description="권한에서 사용할 Subject를 관리합니다."
		>
			<SectionSurface padding="none" elevation="flat">
				<SubjectManagementTab
					subjects={state.subjects}
					onAddSubject={onClickAddSubjectButton}
					onEditSubject={onClickEditSubjectButton}
					onDeleteSubject={onClickDeleteSubjectButton}
				/>
			</SectionSurface>

			{/* Subject 폼 모달 */}
			<SubjectFormModal
				isOpen={state.subjectFormModal.isOpen}
				onClose={onCloseSubjectModal}
				onSubmit={onSubmitSubjectForm}
				mode={state.subjectFormModal.mode}
				initialData={state.subjectFormModal.initialData}
			/>
		</PageSurface>
	);
}

export default observer(SubjectsPageClient);
