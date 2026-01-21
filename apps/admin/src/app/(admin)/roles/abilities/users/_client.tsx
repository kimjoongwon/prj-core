"use client";

import { PageSurface, SectionSurface, UserAbilityManager } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import { useUserAbilitiesPage } from "./hooks";

/**
 * User 예외 권한 관리 페이지 클라이언트 컴포넌트
 *
 * 사용자별 예외 권한을 관리합니다.
 * - 사용자 검색
 * - 예외 권한 추가/수정/삭제
 * - 활성화/비활성화 토글
 */
function UserAbilitiesPageClient() {
	const {
		state,
		onSearchUsers,
		onLoadUserAbilities,
		onAddUserAbility,
		onUpdateUserAbility,
		onDeleteUserAbility,
		onToggleUserAbilityActive,
		onLoadSubjectFields,
	} = useUserAbilitiesPage();

	return (
		<PageSurface
			title="User 예외 권한"
			description="사용자별 예외 권한을 관리합니다."
		>
			<SectionSurface padding="md" elevation="flat">
				<UserAbilityManager
					onSearchUsers={onSearchUsers}
					onLoadAbilities={onLoadUserAbilities}
					onAddAbility={onAddUserAbility}
					onUpdateAbility={onUpdateUserAbility}
					onDeleteAbility={onDeleteUserAbility}
					onToggleActive={onToggleUserAbilityActive}
					subjects={state.subjects}
					actions={state.actions}
					onLoadSubjectFields={onLoadSubjectFields}
				/>
			</SectionSurface>
		</PageSurface>
	);
}

export default observer(UserAbilitiesPageClient);
