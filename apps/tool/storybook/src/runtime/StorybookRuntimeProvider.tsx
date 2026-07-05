/// <reference types="vite/client" />

import {
	Ability,
	AppStore,
	AppStoreContext,
	Cookies,
	FloatingActions,
	Locale,
	MobileNavigation,
	Navigation,
	Session,
	Space,
	Tokens,
	useApp,
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
import { useEffect, useRef, useState } from "react";
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
	setApiLocale,
	setApiSpace,
	setLoginRedirectUrl,
} from "../../../../../packages/fe-api/src/core/client";
import {
	setIdpLocale,
	setIdpLoginRedirectUrl,
	setIdpSpace,
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

function createStorybookAppStore(runtime: StorybookRuntimeConfig): AppStore {
	const app = new AppStore();
	const navigation = new Navigation(getNavigationItems(runtime.realm));
	const space = new Space({
		storageKey: getStorageKey(runtime.realm),
	});
	const locale = new Locale({
		storageKey: `${getStorageKey(runtime.realm)}:locale`,
	});
	const ability = new Ability(app);

	app.name = `STORYBOOK_${runtime.realm.toUpperCase()}`;
	app.tokens = new Tokens(app);
	app.cookies = new Cookies();
	app.session = new Session(app);
	app.ability = ability;
	app.navigation = navigation;
	app.space = space;
	app.locale = locale;
	app.mobileNavigation = new MobileNavigation(
		{
			tabIds: getBottomTabIds(runtime.realm),
			moreTabId: "more",
		},
		{ navigation },
	);
	app.floatingActions = new FloatingActions({
		actions: getFabActions(runtime.realm),
	});

	navigation.setCurrentPath(runtime.currentPath);
	ability.updateRules([...FALLBACK_ABILITY_RULES]);
	setApiSpace(space);
	setIdpSpace(space);
	setApiLocale(locale);
	setIdpLocale(locale);

	return app;
}

const StorybookRuntimeBootstrap = observer(function StorybookRuntimeBootstrap({
	children,
	runtime,
	storyId,
}: PropsWithChildren<{
	runtime: StorybookRuntimeConfig;
	storyId: string;
}>) {
	const app = useApp();
	const space = app.space;
	const ability = app.ability;
	const navigation = app.navigation;
	const locale = app.locale;

	useEffect(() => {
		space.hydrateFromStorage();
		locale.hydrateFromStorage();
		setApiSpace(space);
		setIdpSpace(space);
		setApiLocale(locale);
		setIdpLocale(locale);
		setLoginRedirectUrl(DISABLED_AUTH_REDIRECT_URL);
		setIdpLoginRedirectUrl(DISABLED_AUTH_REDIRECT_URL);
	}, [locale, space, storyId]);

	useEffect(() => {
		navigation.setAbilityChecker((action, subject) =>
			ability.can(action, subject),
		);
		navigation.setCurrentPath(runtime.currentPath);
	}, [ability, navigation, runtime.currentPath]);

	useEffect(() => {
		if (runtime.realm === "admin") {
			space.setSpaces([STORYBOOK_ADMIN_SPACE]);
			space.setSpace(
				STORYBOOK_ADMIN_SPACE.tenantId,
				STORYBOOK_ADMIN_SPACE.groundName,
				null,
				STORYBOOK_ADMIN_SPACE.spaceId,
			);
		}

		space.setSpaceSelectionResolved(true);
		ability.updateRules([...FALLBACK_ABILITY_RULES]);
	}, [ability, space, runtime.realm]);

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
	const appRef = useRef<AppStore | null>(null);
	const [currentPath, setCurrentPath] = useState(runtime.currentPath);
	const navigatorRef = useRef<NavigatorLike | null>(null);

	if (!appRef.current) {
		appRef.current = createStorybookAppStore(runtime);
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
		appRef.current!.navigation.setCurrentPath(currentPath);
		appRef.current!.mobileNavigation.updateActiveTabFromPath(currentPath);
	}, [currentPath]);

	useEffect(() => {
		if (!navigatorRef.current) {
			return;
		}

		appRef.current!.navigation.setNavigator(navigatorRef.current);
		appRef.current!.floatingActions.setNavigator(navigatorRef.current);
	}, []);

	return (
		<QueryClientProvider client={queryClient}>
			<NuqsReactAdapter>
				<AppStoreContext.Provider value={appRef.current}>
					<DesignSystemProvider>
						<StorybookRuntimeBootstrap runtime={runtime} storyId={storyId}>
							{children}
						</StorybookRuntimeBootstrap>
					</DesignSystemProvider>
				</AppStoreContext.Provider>
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
