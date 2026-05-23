import {
  setApiNativeRefreshHandler,
  setApiPersistStore,
} from "@cocrepo/api/core/client";
import {
  setIdpNativeRefreshHandler,
  setIdpPersistStore,
} from "@cocrepo/api/idp/client";
import type { SpaceDto } from "@cocrepo/api/idp/model";
import { makeAutoObservable } from "mobx";

export const MOBILE_PLATFORM_GROUND_NAME = "플랫폼 운영본부";
export const MOBILE_SYSTEM_SPACE_ID = "61ddca20-1752-466e-b4da-879ebdbe54e3";

export interface MobileSpaceInfo {
  spaceId: string;
  groundName: string;
  address?: string | null;
  contentLanguageCode?: string | null;
  imageFileId?: string | null;
  logoImageFileId?: string | null;
}

interface MobileSessionTokens {
  accessToken?: string | null;
  accessTokenExpiresAt?: number | null;
  refreshToken?: string | null;
  refreshTokenExpiresAt?: number | null;
  sessionId?: string | null;
}

const resolveGroundName = (space: SpaceDto) => space.ground?.name ?? "";
const resolveGroundAddress = (space: SpaceDto) =>
  space.ground?.address ?? space.ground?.label ?? null;

export const isSelectableMobileSpace = (space: SpaceDto) =>
  Boolean(space.id && space.ground) &&
  space.id !== MOBILE_SYSTEM_SPACE_ID &&
  space.ground?.name !== MOBILE_PLATFORM_GROUND_NAME;

export const toMobileSpaceInfo = (space: SpaceDto): MobileSpaceInfo => ({
  address: resolveGroundAddress(space),
  contentLanguageCode: space.contentLanguageCode ?? null,
  groundName: resolveGroundName(space),
  imageFileId: space.ground?.imageFileId ?? null,
  logoImageFileId: space.ground?.logoImageFileId ?? null,
  spaceId: space.id,
});

class MobileApiScopeStore {
  spaceId: string | null = null;
  groundName: string | null = null;
  address: string | null = null;
  contentLanguageCode: string | null = null;
  spaces: MobileSpaceInfo[] = [];
  accessToken: string | null = null;
  accessTokenExpiresAt: number | null = null;
  refreshToken: string | null = null;
  refreshTokenExpiresAt: number | null = null;
  sessionId: string | null = null;
  isSpaceSelectionResolved = false;

  constructor() {
    makeAutoObservable(this);
  }

  setSpaces(spaces: SpaceDto[]) {
    this.spaces = spaces
      .filter(isSelectableMobileSpace)
      .map(toMobileSpaceInfo);
  }

  setSpace(space: SpaceDto) {
    const existingSpace = this.spaces.find((item) => item.spaceId === space.id);
    this.spaceId = space.id;
    this.groundName =
      resolveGroundName(space) ||
      existingSpace?.groundName ||
      null;
    this.address = resolveGroundAddress(space) ?? existingSpace?.address ?? null;
    this.contentLanguageCode =
      space.contentLanguageCode ??
      existingSpace?.contentLanguageCode ??
      null;
    this.isSpaceSelectionResolved = true;
  }

  setSpaceInfo(space: MobileSpaceInfo, resolved = true) {
    this.spaceId = space.spaceId;
    this.groundName = space.groundName || null;
    this.address = space.address ?? null;
    this.contentLanguageCode = space.contentLanguageCode ?? null;
    this.isSpaceSelectionResolved = resolved;
  }

  clearSpace() {
    this.spaceId = null;
    this.groundName = null;
    this.address = null;
    this.contentLanguageCode = null;
    this.isSpaceSelectionResolved = true;
  }

  markSpaceSelectionPending() {
    this.spaceId = null;
    this.groundName = null;
    this.address = null;
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
    this.address = null;
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
