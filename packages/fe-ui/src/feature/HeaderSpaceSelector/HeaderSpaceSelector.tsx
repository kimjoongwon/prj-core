"use client";

import { observer } from "mobx-react-lite";
import { SpaceSelectorDropdown } from "../../widget/SpaceSelectorDropdown";
import type { HeaderSpaceSelectorProps } from "./type";

/**
 * HeaderSpaceSelector - 헤더용 Space 선택 Feature 컴포넌트
 *
 * SpaceSelectorDropdown Widget을 래핑하여 헤더에서 Space를 선택할 수 있게 합니다.
 * app 연결은 사용하는 앱에서 props로 주입합니다.
 *
 * @example
 * ```tsx
 * // 앱에서 app.space와 연결하여 사용
 * const app = useApp();
 * const space = app.space;
 *
 * const handleSpaceSelect = (space: SpaceInfo) => {
 *   space.setSpace(space.tenantId, space.groundName, undefined, space.spaceId);
 *   window.location.reload();
 * };
 *
 * <HeaderSpaceSelector
 *   spaces={space.spaces}
 *   currentTenantId={space.tenantId}
 *   currentSpaceName={space.groundName}
 *   onSpaceSelect={handleSpaceSelect}
 * />
 * ```
 */
export const HeaderSpaceSelector = observer(function HeaderSpaceSelector({
	spaces,
	currentTenantId,
	currentSpaceName,
	onSpaceSelect,
}: HeaderSpaceSelectorProps) {
	return (
		<SpaceSelectorDropdown
			spaces={spaces}
			currentTenantId={currentTenantId}
			currentSpaceName={currentSpaceName}
			onSpaceSelect={onSpaceSelect}
		/>
	);
});

HeaderSpaceSelector.displayName = "HeaderSpaceSelector";
