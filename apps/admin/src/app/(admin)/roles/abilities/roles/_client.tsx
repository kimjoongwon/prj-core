"use client";

import { PageSurface, RoleAbilityManager, SectionSurface } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import { useRoleAbilitiesPage } from "./hooks";

/**
 * Role 권한 관리 페이지 클라이언트 컴포넌트
 *
 * Role별 기본 ABAC 권한을 관리합니다.
 * RoleAbilityManager 컴포넌트를 통해 Role 선택, Ability 추가/수정/삭제 기능을 제공합니다.
 */
function RoleAbilitiesPageClient() {
	const {
		state,
		onChangeRoleSelect,
		onLoadRoleAbilities,
		onAddRoleAbility,
		onUpdateRoleAbility,
		onDeleteRoleAbility,
		onToggleRoleAbilityActive,
		onLoadSubjectFields,
	} = useRoleAbilitiesPage();

	return (
		<PageSurface
			title="Role 권한"
			description="Role별 기본 ABAC 권한을 관리합니다."
		>
			<SectionSurface padding="md" elevation="flat">
				<RoleAbilityManager
					roles={state.roles}
					selectedRoleId={state.selectedRoleId ?? undefined}
					onRoleChange={onChangeRoleSelect}
					onLoadAbilities={onLoadRoleAbilities}
					onAddAbility={onAddRoleAbility}
					onUpdateAbility={onUpdateRoleAbility}
					onDeleteAbility={onDeleteRoleAbility}
					onToggleActive={onToggleRoleAbilityActive}
					subjects={state.subjects}
					actions={state.actions}
					onLoadSubjectFields={onLoadSubjectFields}
				/>
			</SectionSurface>
		</PageSurface>
	);
}

export default observer(RoleAbilitiesPageClient);
