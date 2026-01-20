import { createLogger, navigateTo } from "@cocrepo/toolkit";
import { isAxiosError } from "axios";
import { makeAutoObservable } from "mobx";
import { RootStore } from "./rootStore";

const logger = createLogger("[AuthStore]");

export class AuthStore {
  rootStore: RootStore;
  isLoggingOut = false;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    makeAutoObservable(this);
  }

  get isAuthenticated(): boolean {
    return !this.rootStore.tokenStore?.isAccessTokenExpired();
  }

  async handleAuthError(error: unknown) {
    if (isAxiosError(error)) {
      if (error.response?.status === 401) {
        window.location.href = "/admin/auth/login";

        return;
      }
    }

    return Promise.reject(error);
  }

  async logout(logoutApi?: () => Promise<unknown>) {
    try {
      this.isLoggingOut = true;
      logger.info("로그아웃 처리 중...");

      if (logoutApi) {
        await logoutApi();
      }

      navigateTo("/admin/auth/login", true);
    } catch (_error) {
      navigateTo("/admin/auth/login", true);
    } finally {
      this.isLoggingOut = false;
    }
  }
}
