import {
  setApiNativeRefreshHandler,
  setApiSessionScope,
} from "@cocrepo/api/core/client";
import {
  setIdpNativeRefreshHandler,
  setIdpSessionScope,
} from "@cocrepo/api/idp/client";
import type { SpaceDto } from "@cocrepo/api/idp/model";
import { isDecimalId } from "@cocrepo/type";
import { makeAutoObservable } from "mobx";

export const MOBILE_PLATFORM_FITNESS_CENTER_NAME = "플랫폼 운영본부";

export interface MobileSpaceInfo {
  tenantId: string;
  spaceId: string;
  fitnessCenterName: string;
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

const resolveFitnessCenterName = (space: SpaceDto) =>
  space.fitnessCenter?.name ?? "";
const resolveFitnessCenterAddress = (space: SpaceDto) =>
  space.fitnessCenter?.address ??
  space.fitnessCenter?.label ??
  space.fitnessCenter?.company?.address ??
  space.fitnessCenter?.company?.label ??
  null;

/** API 응답의 숫자 ID가 canonical decimal string인지 확인합니다. */
const requireDecimalId = (value: unknown, fieldName: string): string => {
  if (!isDecimalId(value)) {
    throw new TypeError(`${fieldName} must be a canonical decimal ID`);
  }

  return value;
};

/**
 * 모바일 사용자가 직접 선택할 수 있는 FitnessCenter Space인지 확인합니다.
 */
export const isSelectableMobileSpace = (space: SpaceDto) =>
  isDecimalId(space.id) &&
  isDecimalId(space.tenantId) &&
  Boolean(space.fitnessCenter) &&
  space.fitnessCenter?.name !== MOBILE_PLATFORM_FITNESS_CENTER_NAME;

/**
 * API Space와 FitnessCenter/company 관계를 모바일 선택 정보로 정규화합니다.
 */
export const toMobileSpaceInfo = (space: SpaceDto): MobileSpaceInfo => ({
  address: resolveFitnessCenterAddress(space),
  contentLanguageCode: space.contentLanguageCode ?? null,
  fitnessCenterName: resolveFitnessCenterName(space),
  imageFileId: space.fitnessCenter?.imageFileId ?? null,
  logoImageFileId: space.fitnessCenter?.company?.logoImageFileId ?? null,
  spaceId: requireDecimalId(space.id, "space.id"),
  tenantId: requireDecimalId(space.tenantId, "space.tenantId"),
});

class MobileApiScope {
  tenantId: string | null = null;
  spaceId: string | null = null;
  fitnessCenterName: string | null = null;
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
    const existingSpace = this.spaces.find(
      (item) => item.tenantId === space.tenantId,
    );
    this.tenantId = requireDecimalId(
      space.tenantId ?? existingSpace?.tenantId,
      "space.tenantId",
    );
    this.spaceId = requireDecimalId(space.id, "space.id");
    this.fitnessCenterName =
      resolveFitnessCenterName(space) ||
      existingSpace?.fitnessCenterName ||
      null;
    this.address =
      resolveFitnessCenterAddress(space) ?? existingSpace?.address ?? null;
    this.contentLanguageCode =
      space.contentLanguageCode ??
      existingSpace?.contentLanguageCode ??
      null;
    this.isSpaceSelectionResolved = true;
  }

  setSpaceInfo(space: MobileSpaceInfo, resolved = true) {
    this.tenantId = space.tenantId;
    this.spaceId = space.spaceId;
    this.fitnessCenterName = space.fitnessCenterName || null;
    this.address = space.address ?? null;
    this.contentLanguageCode = space.contentLanguageCode ?? null;
    this.isSpaceSelectionResolved = resolved;
  }

  clearSpace() {
    this.tenantId = null;
    this.spaceId = null;
    this.fitnessCenterName = null;
    this.address = null;
    this.contentLanguageCode = null;
    this.isSpaceSelectionResolved = true;
  }

  markSpaceSelectionPending() {
    this.tenantId = null;
    this.spaceId = null;
    this.fitnessCenterName = null;
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
    this.tenantId = null;
    this.spaceId = null;
    this.fitnessCenterName = null;
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

export const mobileApiScope = new MobileApiScope();

export const configureMobileApiScope = (
  nativeRefreshHandler?: (() => Promise<void>) | null,
) => {
  setApiSessionScope(mobileApiScope);
  setIdpSessionScope(mobileApiScope);
  if (nativeRefreshHandler !== undefined) {
    setApiNativeRefreshHandler(nativeRefreshHandler);
    setIdpNativeRefreshHandler(nativeRefreshHandler);
  }
};
