"use client";

import { PageSurface, SectionSurface } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import { UIVisibilityTab } from "../components/UIVisibilityTab";
import { useUIElementsPage } from "./hooks";

/**
 * UI 가시성 페이지 클라이언트 컴포넌트
 *
 * Role별 UI 요소(ui:xxx Subject) 가시성을 매트릭스 형태로 관리합니다.
 */
function UIElementsPageClient() {
	const { state, onChangeVisibility, onSave, onReset } = useUIElementsPage();

	return (
		<PageSurface
			title="UI 가시성"
			description="Role별 UI 요소의 가시성을 관리합니다."
		>
			<SectionSurface padding="none" elevation="flat">
				<UIVisibilityTab
					subjects={state.subjects}
					roles={state.roles}
					onChangeVisibility={onChangeVisibility}
					onSave={onSave}
					onReset={onReset}
				/>
			</SectionSurface>
		</PageSurface>
	);
}

export default observer(UIElementsPageClient);
