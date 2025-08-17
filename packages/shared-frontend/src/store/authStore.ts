import { AXIOS_INSTANCE } from "@shared/api-client";
import { navigateTo, createLogger } from "@shared/utils";
import { isAxiosError } from "axios";
import { makeAutoObservable } from "mobx";
import { PlateStore } from "./plateStore";

const logger = createLogger("[AuthStore]");

export class AuthStore {
	plateStore: PlateStore;
	isLoggingOut = false;

	constructor(plateStore: PlateStore) {
		this.plateStore = plateStore;

		AXIOS_INSTANCE.interceptors.response.use(
			(response) => response,
			(error) => {
				this.handleAuthError(error);
			},
		);

		AXIOS_INSTANCE.interceptors.request.use(
			async (config) => {
				const isATExpired = this.plateStore.tokenStore?.isAccessTokenExpired();
				if (isATExpired) {
					await this.plateStore.tokenStore?.refreshToken();
				}
				return config;
			},
			(error) => {
				return Promise.reject(error);
			},
		);

		makeAutoObservable(this);
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

	async logout(logoutApi?: () => Promise<any>) {
		try {
			this.isLoggingOut = true;
			logger.info("로그아웃 처리 중...");

			// Call backend logout API to clear HttpOnly cookies if provided
			if (logoutApi) {
				await logoutApi();
			}

			// Clear client-side storage
			// TODO: Implement clearLocalStorage and clearSessionStorage functions
			// BrowserUtil.clearLocalStorage();
			// BrowserUtil.clearSessionStorage();

			// Navigate to login page
			navigateTo("/admin/auth/login", true);
		} catch (_error) {
			// logger.error("로그아웃 중 오류가 발생했습니다:", error);

			// Even if API call fails, clear client storage and redirect
			// TODO: Implement clearLocalStorage and clearSessionStorage functions
			// BrowserUtil.clearLocalStorage();
			// BrowserUtil.clearSessionStorage();
			navigateTo("/admin/auth/login", true);
		} finally {
			this.isLoggingOut = false;
		}
	}
}
