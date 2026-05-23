import { makeAutoObservable } from "mobx";
import { getCurrentSpace, getMySpaces, verifyToken } from "@cocrepo/api/idp/auth";
import type { SpaceDto } from "@cocrepo/api/idp/model";
import { setIdpBaseUrl, setIdpLoginRedirectUrl } from "@cocrepo/api/idp/client";
import { getIdpApiBaseUrl, getLoginPath } from "./auth-config";
import {
  clearNativeAuthSession,
  clearNativeSpaceSelection,
  loadNativeAuthSession,
  loadNativeSpaceSelection,
  requestNativeLogin,
  requestNativeLogout,
  requestNativeTokenRefresh,
  saveNativeSpaceSelection,
  saveNativeAuthSession,
  type MobileAuthSession,
} from "./_utils/auth";
import {
  configureMobileApiScope,
  isSelectableMobileSpace,
  mobileApiScopeStore,
  toMobileSpaceInfo,
  type MobileSpaceInfo,
} from "./mobile-api-scope";

type AuthStatus = "unknown" | "authenticated" | "unauthenticated";

const UNKNOWN_PATH = "/";
const DEFAULT_HOME_PATH = "/";

const configureIdpClient = (nativeRefreshHandler?: () => Promise<void>) => {
  configureMobileApiScope(nativeRefreshHandler);
  setIdpBaseUrl(getIdpApiBaseUrl());
  setIdpLoginRedirectUrl(getLoginPath());
};

class MobileAuthStore {
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

  async loginWithCredentials(email: string, password: string): Promise<boolean> {
    configureIdpClient(() => this.refreshNativeSession());
    const session = await requestNativeLogin({
      apiBaseUrl: getIdpApiBaseUrl(),
      email,
      password,
    });
    await this.applySession(session);
    return this.verifySession();
  }

  async logout() {
    this.setVerifying(true);
    try {
      configureIdpClient(() => this.refreshNativeSession());
      const sessionId = mobileApiScopeStore.sessionId;
      if (sessionId) {
        await requestNativeLogout({
          accessToken: mobileApiScopeStore.accessToken,
          apiBaseUrl: getIdpApiBaseUrl(),
          refreshToken: mobileApiScopeStore.refreshToken,
          sessionId,
        }).catch(() => false);
      }
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

  async refreshNativeSession(): Promise<void> {
    const sessionId = mobileApiScopeStore.sessionId;
    const refreshToken = mobileApiScopeStore.refreshToken;
    if (!sessionId || !refreshToken) {
      throw new Error("native_refresh_token_missing");
    }

    const session = await requestNativeTokenRefresh({
      apiBaseUrl: getIdpApiBaseUrl(),
      refreshToken,
      sessionId,
    });
    await this.applySession(session);
  }

  async verifySession(): Promise<boolean> {
    if (this.isVerifying) {
      return this.isAuthenticated;
    }

    this.setVerifying(true);
    try {
      configureIdpClient(() => this.refreshNativeSession());
      await this.restorePersistedSession();
      if (!mobileApiScopeStore.accessToken) {
        throw new Error("session_missing");
      }

      try {
        await this.loadAuthenticatedContext();
      } catch {
        await this.refreshNativeSession();
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

    mobileApiScopeStore.setSpace(space);
    await saveNativeSpaceSelection(toMobileSpaceInfo(space));
  }

  async selectSpaceInfo(space: MobileSpaceInfo): Promise<void> {
    mobileApiScopeStore.setSpaceInfo(space);
    await saveNativeSpaceSelection(space);
  }

  private async restorePersistedSession() {
    if (mobileApiScopeStore.accessToken && mobileApiScopeStore.refreshToken) {
      return;
    }

    const session = await loadNativeAuthSession();
    if (session) {
      mobileApiScopeStore.setSessionTokens(session);
    }
  }

  private async applySession(session: MobileAuthSession) {
    mobileApiScopeStore.setSessionTokens(session);
    await saveNativeAuthSession({
      accessToken: mobileApiScopeStore.accessToken,
      accessTokenExpiresAt: mobileApiScopeStore.accessTokenExpiresAt,
      refreshToken: mobileApiScopeStore.refreshToken,
      refreshTokenExpiresAt: mobileApiScopeStore.refreshTokenExpiresAt,
      sessionId: mobileApiScopeStore.sessionId,
      mustChangePassword: session.mustChangePassword,
    });
  }

  private async clearLocalSession() {
    mobileApiScopeStore.clear();
    await clearNativeAuthSession();
    await clearNativeSpaceSelection();
  }

  private async loadAuthenticatedContext() {
    const verifyResponse = await verifyToken({
      baseURL: getIdpApiBaseUrl(),
    });
    const verifiedSession = verifyResponse.data;
    if (
      verifiedSession?.accessTokenExpiresAt &&
      verifiedSession.refreshTokenExpiresAt
    ) {
      mobileApiScopeStore.setTokenExpiries(
        verifiedSession.accessTokenExpiresAt,
        verifiedSession.refreshTokenExpiresAt,
      );
    }

    mobileApiScopeStore.markSpaceSelectionPending();
    const storedSpaceSelection = await loadNativeSpaceSelection();
    if (storedSpaceSelection) {
      mobileApiScopeStore.setSpaceInfo(storedSpaceSelection, false);
    }

    const mySpacesResponse = await getMySpaces({
      baseURL: getIdpApiBaseUrl(),
    });
    const spaces = mySpacesResponse.data ?? [];
    mobileApiScopeStore.setSpaces(spaces);

    if (!storedSpaceSelection) {
      return;
    }

    const currentSpaceResponse = await getCurrentSpace({
      baseURL: getIdpApiBaseUrl(),
    });
    const currentSpace = currentSpaceResponse.data;
    if (
      currentSpace?.id === storedSpaceSelection.spaceId &&
      isSelectableMobileSpace(currentSpace)
    ) {
      mobileApiScopeStore.setSpace(currentSpace);
      await saveNativeSpaceSelection(toMobileSpaceInfo(currentSpace));
      return;
    }

    await clearNativeSpaceSelection();
    mobileApiScopeStore.markSpaceSelectionPending();
  }
}

export const mobileAuthStore = new MobileAuthStore();
