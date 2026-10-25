import {
  installCoreSessionRecovery,
  setApiSessionScope,
} from "@cocrepo/api/core/client";
import type { SpaceDto } from "@cocrepo/api/core/model";
import { type IntegrationUlid, isIntegrationUlid } from "@cocrepo/type";
import { makeAutoObservable } from "mobx";

export const MOBILE_PLATFORM_SPACE_NAME = "플랫폼 운영본부";

export interface MobileSpaceInfo {
  tenantId: string;
  spaceId: string;
  spaceName: string;
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

const resolveSpaceDisplayName = (space: SpaceDto) => space.name ?? "";
const resolveFitnessCenterAddress = (space: SpaceDto) =>
  space.fitnessCenter?.address ??
  space.label ??
  space.fitnessCenter?.company?.address ??
  space.fitnessCenter?.company?.label ??
  null;

/** API 와이어의 ULID 식별자를 그대로 모바일 상태에 저장하기 위한 가드입니다. */
const requireSpaceUlid = (
  value: unknown,
  fieldName: string,
): IntegrationUlid => {
  if (!isIntegrationUlid(value)) {
    throw new Error(`space_ulid_required:${fieldName}`);
  }
  return value;
};

/**
 * 모바일 사용자가 직접 선택할 수 있는 FitnessCenter Space인지 확인합니다.
 */
export const isSelectableMobileSpace = (space: SpaceDto) =>
  isIntegrationUlid(space.id) &&
  isIntegrationUlid(space.tenantId) &&
  Boolean(space.fitnessCenter) &&
  space.name !== MOBILE_PLATFORM_SPACE_NAME;

/**
 * API Space와 FitnessCenter/company 관계를 모바일 선택 정보로 정규화합니다.
 */
export const toMobileSpaceInfo = (space: SpaceDto): MobileSpaceInfo => ({
  address: resolveFitnessCenterAddress(space),
  contentLanguageCode: space.contentLanguageCode ?? null,
  // 모바일 상태 필드명은 유지하되 값의 원천은 Space 이름입니다.
  spaceName: resolveSpaceDisplayName(space),
  imageFileId: space.fitnessCenter?.imageFileId ?? null,
  logoImageFileId: space.fitnessCenter?.company?.logoImageFileId ?? null,
  spaceId: requireSpaceUlid(space.id, "space.id"),
  tenantId: requireSpaceUlid(space.tenantId, "space.tenantId"),
});

class MobileApiScope {
  tenantId: string | null = null;
  spaceId: string | null = null;
  spaceName: string | null = null;
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
    const tenantId = requireSpaceUlid(space.tenantId, "space.tenantId");
    const existingSpace = this.spaces.find(
      (item) => item.tenantId === tenantId,
    );
    this.tenantId = tenantId;
    this.spaceId = requireSpaceUlid(space.id, "space.id");
    this.spaceName =
      resolveSpaceDisplayName(space) || existingSpace?.spaceName || null;
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
    this.spaceName = space.spaceName || null;
    this.address = space.address ?? null;
    this.contentLanguageCode = space.contentLanguageCode ?? null;
    this.isSpaceSelectionResolved = resolved;
  }

  clearSpace() {
    this.tenantId = null;
    this.spaceId = null;
    this.spaceName = null;
    this.address = null;
    this.contentLanguageCode = null;
    this.isSpaceSelectionResolved = true;
  }

  markSpaceSelectionPending() {
    this.tenantId = null;
    this.spaceId = null;
    this.spaceName = null;
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
    this.spaceName = null;
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
  sessionRefreshHandler?: (() => Promise<void>) | null,
) => {
  setApiSessionScope(mobileApiScope);
  if (sessionRefreshHandler) {
    // 모바일은 브라우저가 아니므로 onSessionExpired(리다이렉트) 없이
    // 갱신 실패를 그대로 호출자에게 돌려보낸다.
    installCoreSessionRecovery({
      refreshSession: sessionRefreshHandler,
    });
  }
};
