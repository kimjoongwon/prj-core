"use client";

import { RoleAbilityManager, UserAbilityManager } from "@cocrepo/ui";
import { Tab, Tabs } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { ActionManagementTab } from "./components/ActionManagementTab";
import { useAbilitiesPage } from "./hooks/useAbilitiesPage";

/**
 * 권한 관리 페이지
 *
 * 3개 탭으로 구성:
 * - Role 권한: Role별 기본 ABAC 권한 관리
 * - User 예외 권한: User별 예외 권한 관리
 * - Action 관리: Action 목록 관리 (CRUD)
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
	const onSelectionChange = (key: React.Key) => {
		handleTabChange(key as "role" | "user" | "action");
	};

	return (
		<div className="space-y-6">
			{/* 페이지 헤더 */}
			<div>
				<h1 className="text-2xl font-bold">권한 관리</h1>
				<p className="text-default-500">RBAC/ABAC 기반 권한을 관리합니다.</p>
			</div>

			{/* 탭 컨테이너 */}
			<Tabs
				aria-label="권한 관리 탭"
				selectedKey={state.activeTab}
				onSelectionChange={onSelectionChange}
				classNames={{
					tabList: "bg-content1 rounded-xl p-1",
					cursor: "bg-primary",
					tab: "px-4 py-2",
					tabContent: "group-data-[selected=true]:text-white",
				}}
			>
				{/* Role 권한 탭 */}
				<Tab key="role" title="Role 권한">
					<div className="pt-4">
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
					</div>
				</Tab>

				{/* User 예외 권한 탭 */}
				<Tab key="user" title="User 예외 권한">
					<div className="pt-4">
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
					</div>
				</Tab>

				{/* Action 관리 탭 */}
				<Tab key="action" title="Action 관리">
					<div className="pt-4">
						<ActionManagementTab actions={state.actions} />
					</div>
				</Tab>
			</Tabs>
		</div>
	);
}

export default observer(AbilitiesPage);
