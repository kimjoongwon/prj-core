import { makeAutoObservable } from "mobx";
import { getCurrentSpace, getMySpaces, verifyToken } from "@cocrepo/api/idp/auth";
import { setIdpBaseUrl, setIdpLoginRedirectUrl } from "@cocrepo/api/idp/client";
import { getIdpApiBaseUrl, getLoginPath } from "./auth-config";
import {
  clearNativeAuthSession,
  loadNativeAuthSession,
  requestNativeLogin,
  requestNativeLogout,
  requestNativeTokenRefresh,
  saveNativeAuthSession,
  type MobileAuthSession,
} from "./_utils/auth";
import {
  configureMobileApiScope,
  mobileApiScopeStore,
} from "./mobile-api-scope";

type AuthStatus = "unknown" | "authenticated" | "unauthenticated";

const UNKNOWN_PATH = "/";
const DEFAULT_HOME_PATH = "/";

const configureIdpClient = (nativeRefreshHandler?: () => Promise<void>) => {
  configureMobileApiScope(nativeRefreshHandler);
  setIdpBaseUrl(getIdpApiBaseUrl());
  setIdpLoginRedirectUrl(getLoginPath());
};

const getFirstUsableSpace = <TSpace extends { id?: string; ground?: unknown }>(
  spaces: TSpace[],
) => spaces.find((space) => space.id && space.ground) ?? spaces[0] ?? null;

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
    const mySpacesResponse = await getMySpaces({
      baseURL: getIdpApiBaseUrl(),
    });
    const spaces = mySpacesResponse.data ?? [];
    mobileApiScopeStore.setSpaces(spaces);

    const currentSpaceResponse = await getCurrentSpace({
      baseURL: getIdpApiBaseUrl(),
    });
    const currentSpace = currentSpaceResponse.data ?? getFirstUsableSpace(spaces);
    if (currentSpace) {
      mobileApiScopeStore.setSpace(currentSpace);
    } else {
      mobileApiScopeStore.clearSpace();
    }
  }
}

export const mobileAuthStore = new MobileAuthStore();
