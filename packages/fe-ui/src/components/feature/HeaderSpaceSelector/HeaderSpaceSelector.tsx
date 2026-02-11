"use client";

import { observer } from "mobx-react-lite";
import { SpaceSelectorDropdown } from "../../widgets/SpaceSelectorDropdown";
import type { HeaderSpaceSelectorProps } from "./types";

/**
 * HeaderSpaceSelector - 헤더용 Space 선택 Feature 컴포넌트
 *
 * SpaceSelectorDropdown Widget을 래핑하여 헤더에서 Space를 선택할 수 있게 합니다.
 * Store 연결은 사용하는 앱에서 props로 주입합니다.
 *
 * @example
 * ```tsx
 * // 앱에서 Store와 연결하여 사용
 * const persistStore = usePersistStore();
 *
 * const handleSpaceSelect = (space: SpaceInfo) => {
 *   persistStore.setSpace(space.spaceId, space.groundName);
 *   window.location.reload();
 * };
 *
 * <HeaderSpaceSelector
 *   spaces={persistStore.spaces}
 *   currentSpaceId={persistStore.spaceId}
 *   currentSpaceName={persistStore.groundName}
 *   onSpaceSelect={handleSpaceSelect}
 * />
 * ```
 */
export const HeaderSpaceSelector = observer(function HeaderSpaceSelector({
	spaces,
	currentSpaceId,
	currentSpaceName,
	onSpaceSelect,
}: HeaderSpaceSelectorProps) {
	return (
		<SpaceSelectorDropdown
			spaces={spaces}
			currentSpaceId={currentSpaceId}
			currentSpaceName={currentSpaceName}
			onSpaceSelect={onSpaceSelect}
		/>
	);
});

HeaderSpaceSelector.displayName = "HeaderSpaceSelector";
