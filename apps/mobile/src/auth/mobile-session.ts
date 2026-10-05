import { makeAutoObservable } from "mobx";
import { getCurrentSpace, getMySpaces, verifyToken } from "@cocrepo/api/idp/auth";
import type { SpaceDto } from "@cocrepo/api/core/model";
import { setApiBaseUrl } from "@cocrepo/api/core/client";
import { getCoreApiBaseUrl } from "./auth-config";
import { loginWithOidcSheet, refreshOidcSession, revokeOidcTokens } from "./oidc/oidc-login";
import {
  clearNativeAuthSession,
  clearNativeSpaceSelection,
  loadNativeAuthSession,
  loadNativeSpaceSelection,
  saveNativeSpaceSelection,
  saveNativeAuthSession,
  type MobileAuthSession,
} from "./_utils/auth";
import {
  configureMobileApiScope,
  isSelectableMobileSpace,
  mobileApiScope,
  toMobileSpaceInfo,
  type MobileSpaceInfo,
} from "./mobile-api-scope";

type AuthStatus = "unknown" | "authenticated" | "unauthenticated";

const UNKNOWN_PATH = "/";
const DEFAULT_HOME_PATH = "/";

const configureIdpClient = (sessionRefreshHandler?: () => Promise<void>) => {
  configureMobileApiScope(sessionRefreshHandler);
  setApiBaseUrl(getCoreApiBaseUrl());
};

class MobileSession {
  isAuthenticated = false;
  authStatus: AuthStatus = "unknown";
  isVerifying = false;
  lastCheckedAt: number | null = null;
  lastFailure = "";
  lastAuthenticatedAt: number | null = null;
  nextPathAfterLogin = UNKNOWN_PATH;

  constructor() {
    makeAutoObservable(this);
  }

  setNextPathAfterLogin(pathname: string) {
    this.nextPathAfterLogin = pathname || UNKNOWN_PATH;
  }

  setVerifying(isVerifying: boolean) {
    this.isVerifying = isVerifying;
  }

  resolveNextPath = () => {
    const nextPath = this.nextPathAfterLogin;
    this.nextPathAfterLogin = UNKNOWN_PATH;
    return nextPath === UNKNOWN_PATH ? DEFAULT_HOME_PATH : nextPath;
  };

  markAuthenticated() {
    this.isAuthenticated = true;
    this.authStatus = "authenticated";
    this.lastCheckedAt = Date.now();
    this.lastAuthenticatedAt = this.lastCheckedAt;
    this.lastFailure = "";
  }

  markUnauthenticated(reason?: string) {
    this.isAuthenticated = false;
    this.authStatus = "unauthenticated";
    this.lastCheckedAt = Date.now();
    this.lastFailure = reason || "unauthenticated";
  }

  markUnknown() {
    this.authStatus = "unknown";
    this.isAuthenticated = false;
    this.lastFailure = "";
  }

  /**
   * IDP 시트 로그인 (WebView 없음).
   * 시스템 인증 세션으로 IDP 로그인 화면을 띄우고 스킴 콜백 + PKCE로
   * 발급자 토큰을 교환받아 기존 세션 저장 구조에 그대로 적용한다.
   */
  async loginWithOidc(): Promise<boolean> {
    configureIdpClient(() => this.refreshSession());
    const session = await loginWithOidcSheet();
    await this.applySession(session);
    return this.verifySession();
  }

  async logout() {
    this.setVerifying(true);
    try {
      configureIdpClient(() => this.refreshSession());
      // 로컬 세션을 지우기 전에 OP에 토큰을 폐기한다(RFC 7009).
      // 폐기는 best-effort라 실패해도 로그아웃을 계속한다.
      await revokeOidcTokens({
        accessToken: mobileApiScope.accessToken,
        refreshToken: mobileApiScope.refreshToken,
      });
      await this.clearLocalSession();
      this.markUnauthenticated("logout");
    } catch (error) {
      await this.clearLocalSession();
      this.markUnauthenticated(
        error instanceof Error ? error.message : "logout_failed",
      );
    } finally {
      this.setVerifying(false);
    }
  }

  /**
   * 저장된 OIDC refresh token으로 발급자 refresh_token 그랜트 갱신을 수행한다.
   * sessionId 기반 구버전 세션은 갱신할 수 없어 재로그인 대상이 된다.
   */
  async refreshSession(): Promise<void> {
    const refreshToken = mobileApiScope.refreshToken;
    if (!refreshToken || mobileApiScope.sessionId) {
      throw new Error("refresh_token_missing");
    }

    const oidcSession = await refreshOidcSession(refreshToken);
    await this.applySession(oidcSession);
  }

  async verifySession(): Promise<boolean> {
    if (this.isVerifying) {
      return this.isAuthenticated;
    }

    this.setVerifying(true);
    try {
      configureIdpClient(() => this.refreshSession());
      await this.restorePersistedSession();
      if (!mobileApiScope.accessToken) {
        throw new Error("session_missing");
      }

      try {
        await this.loadAuthenticatedContext();
      } catch {
        await this.refreshSession();
        await this.loadAuthenticatedContext();
      }

      this.markAuthenticated();
      return true;
    } catch (error) {
      await this.clearLocalSession();
      const failure =
        error instanceof Error ? error.message : "session_invalid";
      this.markUnauthenticated(failure);
      return false;
    } finally {
      this.setVerifying(false);
    }
  }

  async selectSpace(space: SpaceDto): Promise<void> {
    if (!isSelectableMobileSpace(space)) {
      throw new Error("selectable_space_required");
    }

    mobileApiScope.setSpace(space);
    await saveNativeSpaceSelection(toMobileSpaceInfo(space));
  }

  async selectSpaceInfo(space: MobileSpaceInfo): Promise<void> {
    mobileApiScope.setSpaceInfo(space);
    await saveNativeSpaceSelection(space);
  }

  private async restorePersistedSession() {
    if (mobileApiScope.accessToken && mobileApiScope.refreshToken) {
      return;
    }

    const session = await loadNativeAuthSession();
    if (session) {
      mobileApiScope.setSessionTokens(session);
    }
  }

  private async applySession(session: MobileAuthSession) {
    mobileApiScope.setSessionTokens(session);
    await saveNativeAuthSession({
      accessToken: mobileApiScope.accessToken,
      accessTokenExpiresAt: mobileApiScope.accessTokenExpiresAt,
      refreshToken: mobileApiScope.refreshToken,
      refreshTokenExpiresAt: mobileApiScope.refreshTokenExpiresAt,
      sessionId: mobileApiScope.sessionId,
    });
  }

  private async clearLocalSession() {
    mobileApiScope.clear();
    await clearNativeAuthSession();
    await clearNativeSpaceSelection();
  }

  private async loadAuthenticatedContext() {
    const verifyResponse = await verifyToken();
    const verifiedSession = verifyResponse.data;
    if (
      verifiedSession?.accessTokenExpiresAt &&
      verifiedSession.refreshTokenExpiresAt
    ) {
      mobileApiScope.setTokenExpiries(
        verifiedSession.accessTokenExpiresAt,
        verifiedSession.refreshTokenExpiresAt,
      );
    }

    mobileApiScope.markSpaceSelectionPending();
    const storedSpaceSelection = await loadNativeSpaceSelection();
    if (storedSpaceSelection) {
      mobileApiScope.setSpaceInfo(storedSpaceSelection, false);
    }

    const mySpacesResponse = await getMySpaces();
    const spaces = mySpacesResponse.data ?? [];
    mobileApiScope.setSpaces(spaces);

	const currentSpaceResponse = await getCurrentSpace();
	const currentSpace = currentSpaceResponse.data;
	if (
		currentSpace?.tenantId &&
		currentSpace?.id &&
		isSelectableMobileSpace(currentSpace)
	) {
      mobileApiScope.setSpace(currentSpace);
      await saveNativeSpaceSelection(toMobileSpaceInfo(currentSpace));
      return;
    }

    await clearNativeSpaceSelection();
    mobileApiScope.markSpaceSelectionPending();
  }
}

export const mobileSession = new MobileSession();
