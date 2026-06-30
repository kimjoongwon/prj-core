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
} from "@cocrepo/store";
import { DesignSystemProvider } from "@cocrepo/ui";
import {
	isServer,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
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
import type {
	AbilityRule,
	NavigatorLike,
} from "../../../../../packages/common-type/src";
import {
	setApiPersistStore,
	setLoginRedirectUrl,
} from "../../../../../packages/fe-api/src/core/client";
import {
	setIdpLoginRedirectUrl,
	setIdpPersistStore,
} from "../../../../../packages/fe-api/src/idp/client";

type StorybookRealm = "none" | "admin" | "idp";
type StoryRender = () => ReactNode;

interface StorybookRuntimeParameter {
	realm?: StorybookRealm;
	currentPath?: string;
}

interface StorybookContextLike {
	id: string;
	title?: string;
	parameters?: {
		storybookRuntime?: StorybookRuntimeParameter;
	};
}

interface StorybookRuntimeConfig {
	realm: StorybookRealm;
	currentPath: string;
}

interface SpaceOption {
	spaceId: string;
	tenantId: string;
	groundName: string;
}

const DEFAULT_STALE_TIME_MS = 60 * 1000;
const DISABLED_AUTH_REDIRECT_URL = "#storybook-auth-disabled";
const FALLBACK_ABILITY_RULES: AbilityRule[] = [
	{ action: "manage", subject: "all" },
];
const STORYBOOK_ADMIN_SPACE: SpaceOption = {
	spaceId: "storybook-space",
	tenantId: "storybook-tenant",
	groundName: "Storybook Space",
};

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
	const realm = runtime?.realm ?? "none";

	return {
		realm,
		currentPath: runtime?.currentPath ?? getDefaultCurrentPath(realm),
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
	rootStore.authStore = new AuthStore(rootStore);
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
			persistStore.setSpaces([STORYBOOK_ADMIN_SPACE]);
			persistStore.setSpace(
				STORYBOOK_ADMIN_SPACE.tenantId,
				STORYBOOK_ADMIN_SPACE.groundName,
				null,
				STORYBOOK_ADMIN_SPACE.spaceId,
			);
		}

		persistStore.setSpaceSelectionResolved(true);
		abilityStore.updateRules([...FALLBACK_ABILITY_RULES]);
	}, [abilityStore, persistStore, runtime.realm]);

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
	const providerKey = `${context.id}:${runtime.realm}:${runtime.currentPath}`;

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
