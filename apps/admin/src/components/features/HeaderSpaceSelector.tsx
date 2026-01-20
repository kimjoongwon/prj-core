"use client";

import type { SpaceInfo } from "@cocrepo/ui";
import { SpaceSelectorDropdown } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import { usePersistStore } from "../../stores/AppStoreProvider";

/**
 * HeaderSpaceSelector - 헤더용 Space 선택 Feature 컴포넌트
 *
 * PersistStore와 SpaceSelectorDropdown Widget을 연결합니다.
 * Space 선택 시 페이지를 리로드하여 새로운 X-Space-ID 헤더가 적용되도록 합니다.
 *
 * @example
 * ```tsx
 * <AdminLayout
 *   headerActions={<HeaderSpaceSelector />}
 *   // ...other props
 * >
 *   {children}
 * </AdminLayout>
 * ```
 */
export const HeaderSpaceSelector = observer(function HeaderSpaceSelector() {
	const persistStore = usePersistStore();

	const handleSpaceSelect = (space: SpaceInfo) => {
		persistStore.setSpace(space.spaceId, space.groundName);
		// 페이지 리로드하여 새로운 X-Space-ID 헤더 적용
		window.location.reload();
	};

	return (
		<SpaceSelectorDropdown
			spaces={persistStore.spaces}
			currentSpaceId={persistStore.spaceId}
			currentSpaceName={persistStore.groundName}
			onSpaceSelect={handleSpaceSelect}
		/>
	);
});

HeaderSpaceSelector.displayName = "HeaderSpaceSelector";
