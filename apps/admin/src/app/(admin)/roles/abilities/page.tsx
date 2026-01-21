"use client";

import {
	PageSurface,
	RoleAbilityManager,
	SectionSurface,
	UserAbilityManager,
} from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { ActionManagementTab } from "./components/ActionManagementTab";
import { StyledTabs, Tab } from "./components/StyledTabs";
import {
	type SubjectFormData,
	SubjectFormModal,
} from "./components/SubjectFormModal";
import { SubjectManagementTab } from "./components/SubjectManagementTab";
import { UIVisibilityTab } from "./components/UIVisibilityTab";
import { useAbilitiesPage } from "./hooks/useAbilitiesPage";

/**
 * 권한 관리 페이지
 *
 * 5개 탭으로 구성:
 * - Role 권한: Role별 기본 ABAC 권한 관리
 * - User 예외 권한: User별 예외 권한 관리
 * - Subject 관리: Subject 목록 관리 (entity, menu, feature, ui)
 * - Action 관리: Action 목록 관리 (CRUD)
 * - UI 가시성: Role별 UI 요소 가시성 매트릭스 관리
 */
function AbilitiesPage() {
	const {
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
	} = useAbilitiesPage();

	/**
	 * 페이지 마운트 시 초기 데이터 로드
	 */
	useEffect(() => {
		initialize();
	}, []);

	/**
	 * 탭 변경 이벤트 핸들러
	 */
	const onSelectionChangeTab = (key: React.Key) => {
		handleTabChange(
			key as "role" | "user" | "action" | "subject" | "ui-visibility",
		);
	};

	/**
	 * Subject 폼 모달 제출 핸들러
	 */
	const onSubmitSubjectFormModal = (data: SubjectFormData) => {
		if (state.subjectFormModal.mode === "create") {
			handleAddSubject(data);
		} else if (state.subjectFormModal.initialData) {
			handleUpdateSubject(state.subjectFormModal.initialData.id, {
				displayName: data.displayName,
				description: data.description,
			});
		}
	};

	return (
		<PageSurface
			title="권한 관리"
			description="RBAC/ABAC 기반 권한을 관리합니다."
		>
			{/* 탭 컨테이너 */}
			<StyledTabs
				aria-label="권한 관리 탭"
				selectedKey={state.activeTab}
				onSelectionChange={onSelectionChangeTab}
			>
				{/* Role 권한 탭 */}
				<Tab key="role" title="Role 권한">
					<SectionSurface padding="md" elevation="flat">
						<RoleAbilityManager
							roles={state.roles}
							selectedRoleId={state.selectedRoleId ?? undefined}
							onRoleChange={handleRoleChange}
							onLoadAbilities={handleLoadRoleAbilities}
							onAddAbility={handleAddRoleAbility}
							onUpdateAbility={handleUpdateRoleAbility}
							onDeleteAbility={handleDeleteRoleAbility}
							onToggleActive={handleToggleRoleAbilityActive}
							subjects={state.subjects}
							actions={state.actions}
							onLoadSubjectFields={handleLoadSubjectFields}
						/>
					</SectionSurface>
				</Tab>

				{/* User 예외 권한 탭 */}
				<Tab key="user" title="User 예외 권한">
					<SectionSurface padding="md" elevation="flat">
						<UserAbilityManager
							onSearchUsers={handleSearchUsers}
							onLoadAbilities={handleLoadUserAbilities}
							onAddAbility={handleAddUserAbility}
							onUpdateAbility={handleUpdateUserAbility}
							onDeleteAbility={handleDeleteUserAbility}
							onToggleActive={handleToggleUserAbilityActive}
							subjects={state.subjects}
							actions={state.actions}
							onLoadSubjectFields={handleLoadSubjectFields}
						/>
					</SectionSurface>
				</Tab>

				{/* Subject 관리 탭 */}
				<Tab key="subject" title="Subject 관리">
					<SectionSurface padding="md" elevation="flat">
						<SubjectManagementTab
							subjects={state.subjects}
							onAddSubject={handleOpenAddSubjectModal}
							onEditSubject={handleOpenEditSubjectModal}
							onDeleteSubject={handleDeleteSubject}
						/>
					</SectionSurface>
				</Tab>

				{/* Action 관리 탭 */}
				<Tab key="action" title="Action 관리">
					<SectionSurface padding="md" elevation="flat">
						<ActionManagementTab actions={state.actions} />
					</SectionSurface>
				</Tab>

				{/* UI 가시성 탭 */}
				<Tab key="ui-visibility" title="UI 가시성">
					<SectionSurface padding="md" elevation="flat">
						<UIVisibilityTab subjects={state.subjects} roles={state.roles} />
					</SectionSurface>
				</Tab>
			</StyledTabs>

			{/* Subject 폼 모달 */}
			<SubjectFormModal
				isOpen={state.subjectFormModal.isOpen}
				onClose={handleCloseSubjectModal}
				onSubmit={onSubmitSubjectFormModal}
				mode={state.subjectFormModal.mode}
				initialData={state.subjectFormModal.initialData}
			/>
		</PageSurface>
	);
}

export default observer(AbilitiesPage);
