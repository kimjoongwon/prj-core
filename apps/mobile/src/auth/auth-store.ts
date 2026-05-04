import { makeAutoObservable } from "mobx";
import {
	verifyToken,
	logout as logoutApi,
} from "@cocrepo/api/idp/auth";
import { setIdpBaseUrl, setIdpLoginRedirectUrl } from "@cocrepo/api/idp/client";
import { getIdpApiBaseUrl, getLoginPath } from "./auth-config";

type AuthStatus = "unknown" | "authenticated" | "unauthenticated";

const UNKNOWN_PATH = "/";
const DEFAULT_HOME_PATH = "/";

const configureIdpClient = () => {
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

	async logout() {
		this.setVerifying(true);
		try {
			configureIdpClient();
			await logoutApi();
			this.markUnauthenticated("logout");
		} catch (error) {
			this.markUnauthenticated(
				error instanceof Error ? error.message : "logout_failed",
			);
		} finally {
			this.setVerifying(false);
		}
	}

	async verifySession(): Promise<boolean> {
		if (this.isVerifying) {
			return this.isAuthenticated;
		}

		this.setVerifying(true);
		try {
			configureIdpClient();
			await verifyToken();
			this.markAuthenticated();
			return true;
		} catch (error) {
			const failure = error instanceof Error ? error.message : "session_invalid";
			this.markUnauthenticated(failure);
			return false;
		} finally {
			this.setVerifying(false);
		}
	}
}

export const mobileAuthStore = new MobileAuthStore();
