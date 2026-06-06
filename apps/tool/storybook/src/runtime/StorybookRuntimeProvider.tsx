/// <reference types="vite/client" />

import {
	AbilityStore,
	AuthStore,
	BottomTabStore,
	CookieStore,
	FABStore,
	NavigationStore,
	PersistStore,
	RootStore,
	RootStoreContext,
	TokenStore,
	usePersistStore,
} from "@cocrepo/store";
import { DesignSystemProvider } from "@cocrepo/ui";
import { isServer, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import { NuqsAdapter as NuqsReactAdapter } from "nuqs/adapters/react";
import type { PropsWithChildren, ReactNode } from "react";
import { useContext, useEffect, useRef, useState } from "react";
import {
	ADMIN_FAB_ACTIONS,
	ADMIN_NAV_ITEMS,
	BOTTOM_TAB_IDS,
	IDP_NAV_ITEMS,
} from "../../../../../packages/common-constant/src";
import type { AbilityRule, NavigatorLike } from "../../../../../packages/common-type/src";
import {
	setApiPersistStore,
	setLoginRedirectUrl,
} from "../../../../../packages/fe-api/src/core/client";
import {
	setIdpLoginRedirectUrl,
	setIdpPersistStore,
} from "../../../../../packages/fe-api/src/idp/client";

type StorybookRealm = "none" | "admin" | "idp";
type StorybookRealmGlobal = StorybookRealm | "auto";
type StoryRender = () => ReactNode;

interface StorybookRuntimeParameter {
	realm?: StorybookRealm;
	requiresSpace?: boolean;
	currentPath?: string;
	spaceId?: string;
}

interface StorybookContextLike {
	id: string;
	title?: string;
	globals?: {
		storybookRealm?: StorybookRealmGlobal;
	};
	parameters?: {
		storybookRuntime?: StorybookRuntimeParameter;
	};
}

interface StorybookRuntimeConfig {
	realm: StorybookRealm;
	requiresSpace: boolean;
	currentPath: string;
	spaceId?: string;
}

interface SpaceOption {
	spaceId: string;
	groundName: string;
}

const DEFAULT_STALE_TIME_MS = 60 * 1000;
const DISABLED_AUTH_REDIRECT_URL = "#storybook-auth-disabled";
const FALLBACK_ABILITY_RULES: AbilityRule[] = [
	{ action: "manage", subject: "all" },
];
const STATIC_ADMIN_SPACES: SpaceOption[] = [
	{
		spaceId: "storybook-space",
		groundName: "Storybook Space",
	},
	{
		spaceId: "storybook-ops-space",
		groundName: "Storybook Ops",
	},
	{
		spaceId: "storybook-growth-space",
		groundName: "Storybook Growth",
	},
];

function createStorybookAuthStore(rootStore: RootStore): AuthStore {
	const authStore = new AuthStore(rootStore);

	authStore.logout = async (logoutApi?: () => Promise<unknown>) => {
		try {
			authStore.isLoggingOut = true;
			if (logoutApi) {
				await logoutApi();
			}
		} finally {
			rootStore.persistStore?.clearNativeAuthSession();
			authStore.isLoggingOut = false;
		}
	};

	return authStore;
}

function makeQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: DEFAULT_STALE_TIME_MS,
				retry: false,
			},
		},
	});
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
	if (isServer) {
		return makeQueryClient();
	}

	if (!browserQueryClient) {
		browserQueryClient = makeQueryClient();
	}

	return browserQueryClient;
}

function resolveRuntimeConfig(
	context: StorybookContextLike,
): StorybookRuntimeConfig {
	const runtime = context.parameters?.storybookRuntime;
	const globalRealm = context.globals?.storybookRealm;
	const realm =
		runtime?.realm ??
		(globalRealm && globalRealm !== "auto" ? globalRealm : "none");

	return {
		realm,
		requiresSpace:
			runtime?.requiresSpace !== undefined
				? runtime.requiresSpace
				: realm === "admin",
		currentPath: runtime?.currentPath ?? getDefaultCurrentPath(realm),
		spaceId: runtime?.spaceId,
	};
}

function getDefaultCurrentPath(realm: StorybookRealm): string {
	if (realm === "idp") {
		return "/oidc-clients";
	}

	return "/dashboard";
}

function getStorageKey(realm: StorybookRealm): string {
	if (realm === "idp") {
		return "storybook-idp-persist";
	}

	if (realm === "admin") {
		return "storybook-admin-persist";
	}

	return "storybook-none-persist";
}

function getNavigationItems(realm: StorybookRealm) {
	if (realm === "idp") {
		return IDP_NAV_ITEMS;
	}

	return ADMIN_NAV_ITEMS;
}

function getBottomTabIds(realm: StorybookRealm) {
	if (realm === "idp") {
		return [];
	}

	return [...BOTTOM_TAB_IDS];
}

function getFabActions(realm: StorybookRealm) {
	if (realm === "idp") {
		return [];
	}

	return ADMIN_FAB_ACTIONS;
}

function createStorybookRootStore(runtime: StorybookRuntimeConfig): RootStore {
	const rootStore = new RootStore();
	const navigationStore = new NavigationStore(
		getNavigationItems(runtime.realm),
	);
	const persistStore = new PersistStore({
		storageKey: getStorageKey(runtime.realm),
	});
	const abilityStore = new AbilityStore(rootStore);

	rootStore.name = `STORYBOOK_${runtime.realm.toUpperCase()}`;
	rootStore.tokenStore = new TokenStore(rootStore);
	rootStore.cookieStore = new CookieStore();
	rootStore.authStore = createStorybookAuthStore(rootStore);
	rootStore.abilityStore = abilityStore;
	rootStore.navigationStore = navigationStore;
	rootStore.persistStore = persistStore;
	rootStore.bottomTabStore = new BottomTabStore(
		{
			tabIds: getBottomTabIds(runtime.realm),
			moreTabId: "more",
		},
		{ navigationStore },
	);
	rootStore.fabStore = new FABStore({
		actions: getFabActions(runtime.realm),
	});

	navigationStore.setCurrentPath(runtime.currentPath);
	abilityStore.updateRules([...FALLBACK_ABILITY_RULES]);
	setApiPersistStore(persistStore);
	setIdpPersistStore(persistStore);

	return rootStore;
}

function useRootStore(): RootStore {
	const store = useContext(RootStoreContext);
	if (!store) {
		throw new Error("StorybookRuntimeProvider requires RootStoreContext.");
	}
	return store;
}

const AdminSpaceBar = observer(function AdminSpaceBar() {
	const persistStore = usePersistStore();

	if (
		!persistStore.isHydrated ||
		!persistStore.spaceId ||
		persistStore.spaces.length === 0
	) {
		return null;
	}

	if (persistStore.spaces.length === 1) {
		return (
			<div className="mb-4 flex items-center gap-3 rounded-2xl border border-border bg-surface/90 px-4 py-3 shadow-sm backdrop-blur">
				<span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
					Admin Realm
				</span>
				<span className="text-sm font-medium text-foreground">
					{persistStore.groundName}
				</span>
			</div>
		);
	}

	return (
		<div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-surface/90 px-4 py-3 shadow-sm backdrop-blur">
			<span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
				Admin Realm
			</span>
			<label
				className="text-sm text-muted"
				htmlFor="storybook-space-select"
			>
				Space
			</label>
			<select
				id="storybook-space-select"
				className="min-w-[220px] rounded-xl border border-border bg-surface-secondary px-3 py-2 text-sm text-foreground"
				value={persistStore.spaceId}
				onChange={(event) => {
					const nextSpace = persistStore.spaces.find(
						(space) => space.spaceId === event.target.value,
					);
					if (!nextSpace) {
						return;
					}

					persistStore.setSpace(nextSpace.spaceId, nextSpace.groundName);
				}}
			>
				{persistStore.spaces.map((space) => (
					<option key={space.spaceId} value={space.spaceId}>
						{space.groundName}
					</option>
				))}
			</select>
		</div>
	);
});

const StorybookRuntimeBootstrap = observer(function StorybookRuntimeBootstrap({
	children,
	runtime,
	storyId,
}: PropsWithChildren<{
	runtime: StorybookRuntimeConfig;
	storyId: string;
}>) {
	const store = useRootStore();
	const persistStore = store.persistStore;
	const abilityStore = store.abilityStore;
	const navigationStore = store.navigationStore;

	useEffect(() => {
		if (!persistStore) {
			return;
		}

		persistStore.hydrateFromStorage();
		setApiPersistStore(persistStore);
		setIdpPersistStore(persistStore);
		setLoginRedirectUrl(DISABLED_AUTH_REDIRECT_URL);
		setIdpLoginRedirectUrl(DISABLED_AUTH_REDIRECT_URL);
	}, [persistStore, storyId]);

	useEffect(() => {
		if (!navigationStore || !abilityStore) {
			return;
		}

		navigationStore.setAbilityChecker((action, subject) =>
			abilityStore.can(action, subject),
		);
		navigationStore.setCurrentPath(runtime.currentPath);
	}, [abilityStore, navigationStore, runtime.currentPath]);

	useEffect(() => {
		if (!persistStore || !abilityStore) {
			return;
		}

		if (runtime.realm === "admin") {
			const persistedSpace = persistStore.spaceId
				? STATIC_ADMIN_SPACES.find(
						(space) => space.spaceId === persistStore.spaceId,
					)
				: undefined;
			const requestedSpace = runtime.spaceId
				? STATIC_ADMIN_SPACES.find(
						(space) => space.spaceId === runtime.spaceId,
					)
				: undefined;
			const nextSpace = requestedSpace ?? persistedSpace ?? STATIC_ADMIN_SPACES[0];

			persistStore.setSpaces(STATIC_ADMIN_SPACES);
			persistStore.setSpace(nextSpace.spaceId, nextSpace.groundName);
		}

		persistStore.setSpaceSelectionResolved(true);
		abilityStore.updateRules([...FALLBACK_ABILITY_RULES]);
	}, [abilityStore, persistStore, runtime.realm, runtime.spaceId]);

	if (runtime.realm === "admin") {
		return (
			<div className="p-4">
				<AdminSpaceBar />
				{children}
			</div>
		);
	}

	return children;
});

export function StorybookRuntimeProvider({
	children,
	runtime,
	storyId,
}: PropsWithChildren<{
	runtime: StorybookRuntimeConfig;
	storyId: string;
}>) {
	const queryClient = getQueryClient();
	const storeRef = useRef<RootStore | null>(null);
	const [currentPath, setCurrentPath] = useState(runtime.currentPath);
	const navigatorRef = useRef<NavigatorLike | null>(null);

	if (!storeRef.current) {
		storeRef.current = createStorybookRootStore(runtime);
	}

	if (!navigatorRef.current) {
		navigatorRef.current = {
			push: (path: string) => {
				setCurrentPath(path);
			},
		};
	}

	useEffect(() => {
		setCurrentPath(runtime.currentPath);
	}, [runtime.currentPath]);

	useEffect(() => {
		storeRef.current?.navigationStore?.setCurrentPath(currentPath);
		storeRef.current?.bottomTabStore?.updateActiveTabFromPath(currentPath);
	}, [currentPath]);

	useEffect(() => {
		if (!navigatorRef.current) {
			return;
		}

		storeRef.current?.navigationStore?.setNavigator(navigatorRef.current);
		storeRef.current?.fabStore?.setNavigator(navigatorRef.current);
	}, []);

	return (
		<QueryClientProvider client={queryClient}>
			<NuqsReactAdapter>
				<RootStoreContext.Provider value={storeRef.current}>
					<DesignSystemProvider>
						<StorybookRuntimeBootstrap runtime={runtime} storyId={storyId}>
							{children}
						</StorybookRuntimeBootstrap>
					</DesignSystemProvider>
				</RootStoreContext.Provider>
			</NuqsReactAdapter>
		</QueryClientProvider>
	);
}

export function withStorybookRuntime(
	Story: StoryRender,
	context: StorybookContextLike,
) {
	const runtime = resolveRuntimeConfig(context);
	const providerKey = `${context.id}:${runtime.realm}:${runtime.currentPath}:${runtime.requiresSpace}:${runtime.spaceId ?? "default"}`;

	return (
		<StorybookRuntimeProvider
			key={providerKey}
			runtime={runtime}
			storyId={context.id}
		>
			<Story />
		</StorybookRuntimeProvider>
	);
}
