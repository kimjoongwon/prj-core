import {
  setApiNativeRefreshHandler,
  setApiPersistStore,
} from "@cocrepo/api/core/client";
import {
  setIdpNativeRefreshHandler,
  setIdpPersistStore,
} from "@cocrepo/api/idp/client";
import type { SpaceDto } from "@cocrepo/api/idp/model";

interface MobileSpaceInfo {
  spaceId: string;
  groundName: string;
  contentLanguageCode?: string | null;
}

interface MobileSessionTokens {
  accessToken?: string | null;
  accessTokenExpiresAt?: number | null;
  refreshToken?: string | null;
  refreshTokenExpiresAt?: number | null;
  sessionId?: string | null;
}

const resolveGroundName = (space: SpaceDto) => space.ground?.name ?? "";

class MobileApiScopeStore {
  spaceId: string | null = null;
  groundName: string | null = null;
  contentLanguageCode: string | null = null;
  spaces: MobileSpaceInfo[] = [];
  accessToken: string | null = null;
  accessTokenExpiresAt: number | null = null;
  refreshToken: string | null = null;
  refreshTokenExpiresAt: number | null = null;
  sessionId: string | null = null;
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

  markSpaceSelectionPending() {
    this.spaceId = null;
    this.groundName = null;
    this.contentLanguageCode = null;
    this.isSpaceSelectionResolved = false;
  }

  setTokenExpiries(
    accessTokenExpiresAt: number,
    refreshTokenExpiresAt: number,
  ) {
    this.accessTokenExpiresAt = accessTokenExpiresAt;
    this.refreshTokenExpiresAt = refreshTokenExpiresAt;
  }

  setSessionTokens(session: MobileSessionTokens) {
    this.accessToken = session.accessToken || this.accessToken;
    this.refreshToken = session.refreshToken || this.refreshToken;
    this.sessionId = session.sessionId || this.sessionId;
    this.accessTokenExpiresAt =
      session.accessTokenExpiresAt ?? this.accessTokenExpiresAt;
    this.refreshTokenExpiresAt =
      session.refreshTokenExpiresAt ?? this.refreshTokenExpiresAt;
  }

  clear() {
    this.spaceId = null;
    this.groundName = null;
    this.contentLanguageCode = null;
    this.spaces = [];
    this.accessToken = null;
    this.accessTokenExpiresAt = null;
    this.refreshToken = null;
    this.refreshTokenExpiresAt = null;
    this.sessionId = null;
    this.isSpaceSelectionResolved = true;
  }
}

export const mobileApiScopeStore = new MobileApiScopeStore();

export const configureMobileApiScope = (
  nativeRefreshHandler?: (() => Promise<void>) | null,
) => {
  setApiPersistStore(mobileApiScopeStore);
  setIdpPersistStore(mobileApiScopeStore);
  if (nativeRefreshHandler !== undefined) {
    setApiNativeRefreshHandler(nativeRefreshHandler);
    setIdpNativeRefreshHandler(nativeRefreshHandler);
  }
};
