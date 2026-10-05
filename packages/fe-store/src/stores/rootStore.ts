import type { DecimalId, NavItemConfig, NavigatorLike } from "@cocrepo/type";
import { makeAutoObservable, runInAction } from "mobx";
import { AccessControlStore } from "./accessControl/accessControlStore";
import { AccountStore } from "./account/accountStore";
import { AuthSession } from "./account/authSession";
import { AppStore } from "./appStore";
import { LanguageStore } from "./language/languageStore";
import { ModalStore } from "./modal/modalStore";
import { NavigationStore } from "./navigation/navigationStore";
import { Navigator, type Router } from "./navigation/navigator";
import {
	PersistStorage,
	type PersistStorageAdapter,
} from "./persistence/persistStorage";

export interface RootStoreConfig {
	appName: string;
	navItems: NavItemConfig[];
	persistStorageKey: string;
	storageAdapter: PersistStorageAdapter;
}

/**
 * API client가 인증과 tenant 정보를 읽고 갱신하는 공유 참조입니다.
 */
export interface AppSessionScope {
	accessToken?: string | null;
	accessTokenExpiresAt?: number | null;
	refreshToken?: string | null;
	refreshTokenExpiresAt?: number | null;
	sessionId?: string | null;
	tenantId?: DecimalId | null;
}

/**
 * RootStore가 앱 실행 전에 연결할 platform runtime callback입니다.
 */
export interface RootStoreRuntimeBindings {
	sessionScopeBinders: ReadonlyArray<(scope: AppSessionScope) => void>;
	languageBinders: ReadonlyArray<(language: LanguageStore) => void>;
}

/**
 * 앱 상태를 조립하고 initialize -> start 생명주기를 관리합니다.
 *
 * constructor는 저장소나 platform runtime을 읽지 않습니다. 앱 실행 전에
 * `initialize()`를 호출하고 브라우저 mount 이후 `start()`를 호출합니다.
 */
export class RootStore {
	readonly app: AppStore;
	readonly sessionScope: AppSessionScope;
	isInitialized = false;
	isStarted = false;

	constructor(config: RootStoreConfig) {
		const persistStorage = new PersistStorage(
			config.persistStorageKey,
			config.storageAdapter,
		);
		const authSession = new AuthSession(persistStorage);
		const account = new AccountStore({
			authSession,
			persistStorage,
		});
		const accessControl = new AccessControlStore();
		const language = new LanguageStore(persistStorage);
		const modal = new ModalStore();
		const navigation = new NavigationStore(config.navItems);

		this.app = new AppStore({
			account,
			accessControl,
			language,
			modal,
			navigation,
			name: config.appName,
		});
		this.sessionScope = createAppSessionScope(this.app);

		makeAutoObservable(this, {
			app: false,
			sessionScope: false,
		});
	}

	/**
	 * cross-store 관계와 platform runtime binding을 한 번 연결합니다.
	 */
	initialize(bindings: RootStoreRuntimeBindings): void {
		if (this.isInitialized) {
			return;
		}

		this.app.navigation.setAbilityChecker((action, subject) =>
			this.app.accessControl.can(action, subject),
		);

		for (const bindSessionScope of bindings.sessionScopeBinders) {
			bindSessionScope(this.sessionScope);
		}

		for (const bindLanguage of bindings.languageBinders) {
			bindLanguage(this.app.language);
		}

		this.isInitialized = true;
	}

	/**
	 * 브라우저 저장소에 남아 있는 앱 상태를 한 번 복원합니다.
	 */
	start(): void {
		if (!this.isInitialized) {
			throw new Error("RootStore.initialize() must be called before start().");
		}

		if (this.isStarted) {
			return;
		}

		this.app.account.authSession.hydrateFromStorage();
		this.app.account.hydrateFromStorage();
		this.app.language.hydrateFromStorage();
		this.isStarted = true;
	}

	/**
	 * platform router를 Navigator로 감싸 NavigationStore에 연결합니다.
	 */
	setRouter(router: Router, basePath?: string): void {
		this.setNavigator(new Navigator({ router, basePath }));
	}

	/**
	 * 현재 런타임의 페이지 이동 adapter를 NavigationStore에 연결합니다.
	 */
	setNavigator(navigator: NavigatorLike): void {
		this.app.navigation.setNavigator(navigator);
	}

	/**
	 * 현재 URL을 NavigationStore 상태에 반영합니다.
	 */
	setCurrentPath(path: string): void {
		this.app.navigation.setCurrentPath(path);
	}
}

function createAppSessionScope(app: AppStore): AppSessionScope {
	return {
		get accessToken() {
			return app.account.authSession.accessToken;
		},
		set accessToken(value: string | null | undefined) {
			runInAction(() => {
				app.account.authSession.accessToken = value ?? null;
			});
		},
		get accessTokenExpiresAt() {
			return app.account.authSession.accessTokenExpiresAt;
		},
		set accessTokenExpiresAt(value: number | null | undefined) {
			runInAction(() => {
				app.account.authSession.accessTokenExpiresAt = value ?? null;
			});
		},
		get refreshToken() {
			return app.account.authSession.refreshToken;
		},
		set refreshToken(value: string | null | undefined) {
			runInAction(() => {
				app.account.authSession.refreshToken = value ?? null;
			});
		},
		get refreshTokenExpiresAt() {
			return app.account.authSession.refreshTokenExpiresAt;
		},
		set refreshTokenExpiresAt(value: number | null | undefined) {
			runInAction(() => {
				app.account.authSession.refreshTokenExpiresAt = value ?? null;
			});
		},
		get sessionId() {
			return app.account.authSession.sessionId;
		},
		set sessionId(value: string | null | undefined) {
			runInAction(() => {
				app.account.authSession.sessionId = value ?? null;
			});
		},
		get tenantId() {
			return app.account.currentTenantId;
		},
	};
}
