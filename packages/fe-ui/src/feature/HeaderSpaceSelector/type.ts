import type { SpaceInfo } from "@cocrepo/store";

/**
 * HeaderSpaceSelector에서 사용하는 Space 데이터 인터페이스
 */
export interface HeaderSpaceSelectorSpace extends SpaceInfo {}

/**
 * HeaderSpaceSelector Props
 */
export interface HeaderSpaceSelectorProps {
	/** 선택 가능한 Space 목록 */
	spaces: SpaceInfo[];
	/** 현재 선택된 Tenant ID */
	currentTenantId: string | null;
	/** 현재 선택된 Space 이름 */
	currentSpaceName: string | null;
	/**
	 * Space 선택 핸들러
	 * @param space 선택된 Space 정보
	 */
	onSpaceSelect: (space: SpaceInfo) => void;
}
