import { setApiPersistStore } from "@cocrepo/api/core/client";
import { setIdpPersistStore } from "@cocrepo/api/idp/client";
import type { SpaceDto } from "@cocrepo/api/idp/model";

interface MobileSpaceInfo {
	spaceId: string;
	groundName: string;
	contentLanguageCode?: string | null;
}

const resolveGroundName = (space: SpaceDto) => space.ground?.name ?? "";

class MobileApiScopeStore {
	spaceId: string | null = null;
	groundName: string | null = null;
	contentLanguageCode: string | null = null;
	spaces: MobileSpaceInfo[] = [];
	accessTokenExpiresAt: number | null = null;
	refreshTokenExpiresAt: number | null = null;
	isSpaceSelectionResolved = false;

	setSpaces(spaces: SpaceDto[]) {
		this.spaces = spaces
			.filter((space) => space.id && space.ground)
			.map((space) => ({
				spaceId: space.id,
				groundName: resolveGroundName(space),
				contentLanguageCode: space.contentLanguageCode ?? null,
			}));
	}

	setSpace(space: SpaceDto) {
		this.spaceId = space.id;
		this.groundName =
			resolveGroundName(space) ||
			this.spaces.find((item) => item.spaceId === space.id)?.groundName ||
			null;
		this.contentLanguageCode =
			space.contentLanguageCode ??
			this.spaces.find((item) => item.spaceId === space.id)
				?.contentLanguageCode ??
			null;
		this.isSpaceSelectionResolved = true;
	}

	clearSpace() {
		this.spaceId = null;
		this.groundName = null;
		this.contentLanguageCode = null;
		this.isSpaceSelectionResolved = true;
	}

	setTokenExpiries(accessTokenExpiresAt: number, refreshTokenExpiresAt: number) {
		this.accessTokenExpiresAt = accessTokenExpiresAt;
		this.refreshTokenExpiresAt = refreshTokenExpiresAt;
	}

	clear() {
		this.spaceId = null;
		this.groundName = null;
		this.contentLanguageCode = null;
		this.spaces = [];
		this.accessTokenExpiresAt = null;
		this.refreshTokenExpiresAt = null;
		this.isSpaceSelectionResolved = true;
	}
}

export const mobileApiScopeStore = new MobileApiScopeStore();

export const configureMobileApiScope = () => {
	setApiPersistStore(mobileApiScopeStore);
	setIdpPersistStore(mobileApiScopeStore);
};
