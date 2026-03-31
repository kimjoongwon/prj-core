import { SetMetadata } from "@nestjs/common";

export enum SpaceScope {
	/** @OnlyMySpace: selectedSpaceId 1개만 */
	CURRENT = "current",
	/** @AccessibleSpaces: 카테고리 계층 기반 하위 Space 포함 (기본값) */
	DESCENDANTS = "descendants",
}

export const SPACE_SCOPE_KEY = "space_scope";

/** 현재 Space만 사용 (selectedSpaceId 1개) */
export const OnlyMySpace = () =>
	SetMetadata(SPACE_SCOPE_KEY, SpaceScope.CURRENT);

/** 하위 Space 포함 (카테고리 계층 기반, 기본값과 동일) */
export const AccessibleSpaces = () =>
	SetMetadata(SPACE_SCOPE_KEY, SpaceScope.DESCENDANTS);
