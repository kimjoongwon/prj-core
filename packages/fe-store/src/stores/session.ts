import { createLogger, navigateTo } from "@cocrepo/toolkit";
import { makeAutoObservable } from "mobx";
import type { AppStore } from "./appStore";

const logger = createLogger("[Session]");

export class Session {
	app: AppStore;
	isLoggingOut = false;

	constructor(app: AppStore) {
		this.app = app;

		makeAutoObservable(this);
	}

	get isAuthenticated(): boolean {
		return !this.app.space?.isAccessTokenExpired;
	}

	async handleAuthError(error: unknown) {
		// 401은 customAxios 인터셉터에서 토큰 갱신을 시도합니다.
		// 갱신 실패 시 인터셉터가 로그인 페이지로 리다이렉트합니다.
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
