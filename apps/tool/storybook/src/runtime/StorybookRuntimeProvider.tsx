/// <reference types="vite/client" />

import {
	type AccountSpaceInfo,
	AppContext,
	browserPersistStorageAdapter,
	RootStore,
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
	ADMIN_NAV_ITEMS,
	IDP_NAV_ITEMS,
} from "../../../../../packages/common-constant/src";
import type {
	AbilityRule,
	NavigatorLike,
} from "../../../../../packages/common-type/src";
import {
	setApiLocale,
	setApiSessionScope,
	setLoginRedirectUrl,
} from "../../../../../packages/fe-api/src/core/client";
import {
	setIdpLocale,
	setIdpLoginRedirectUrl,
	setIdpSessionScope,
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

const DEFAULT_STALE_TIME_MS = 60 * 1000;
const DISABLED_AUTH_REDIRECT_URL = "#storybook-auth-disabled";
const FALLBACK_ABILITY_RULES: AbilityRule[] = [
	{ action: "manage", subject: "all" },
];
const STORYBOOK_ADMIN_SPACE: AccountSpaceInfo = {
	spaceId: "storybook-space",
	tenantId: "storybook-tenant",
	fitnessCenterName: "Storybook Fitness Center",
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

function getPersistStorageKey(realm: StorybookRealm): string {
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

function createStorybookRootStore(runtime: StorybookRuntimeConfig): RootStore {
	const root = new RootStore({
		appName: `STORYBOOK_${runtime.realm.toUpperCase()}`,
		navItems: getNavigationItems(runtime.realm),
		persistStorageKey: getPersistStorageKey(runtime.realm),
		storageAdapter: browserPersistStorageAdapter,
	});

	root.initialize({
		sessionScopeBinders: [setApiSessionScope, setIdpSessionScope],
		languageBinders: [setApiLocale, setIdpLocale],
	});
	root.setCurrentPath(runtime.currentPath);
	root.app.accessControl.updateRules([...FALLBACK_ABILITY_RULES]);
	setLoginRedirectUrl(DISABLED_AUTH_REDIRECT_URL);
	setIdpLoginRedirectUrl(DISABLED_AUTH_REDIRECT_URL);

	return root;
}

const StorybookRuntimeBootstrap = observer(function StorybookRuntimeBootstrap({
	children,
	root,
	runtime,
	storyId,
}: PropsWithChildren<{
	root: RootStore;
	runtime: StorybookRuntimeConfig;
	storyId: string;
}>) {
	const app = useApp();
	const account = app.account;
	const accessControl = app.accessControl;

	useEffect(() => {
		root.start();
	}, [root, storyId]);

	useEffect(() => {
		root.setCurrentPath(runtime.currentPath);
	}, [root, runtime.currentPath]);

	useEffect(() => {
		if (runtime.realm === "admin") {
			account.setAvailableSpaces([STORYBOOK_ADMIN_SPACE]);
			account.setCurrentTenant(
				STORYBOOK_ADMIN_SPACE.tenantId,
				STORYBOOK_ADMIN_SPACE.fitnessCenterName,
				null,
				STORYBOOK_ADMIN_SPACE.spaceId,
			);
		}

		account.setSelectionResolved(true);
		accessControl.updateRules([...FALLBACK_ABILITY_RULES]);
	}, [accessControl, account, runtime.realm]);

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
	const rootRef = useRef<RootStore | null>(null);
	const [currentPath, setCurrentPath] = useState(runtime.currentPath);
	const navigatorRef = useRef<NavigatorLike | null>(null);

	if (!rootRef.current) {
		rootRef.current = createStorybookRootStore(runtime);
	}
	const root = rootRef.current;

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
		root.setCurrentPath(currentPath);
	}, [currentPath, root]);

	useEffect(() => {
		if (!navigatorRef.current) {
			return;
		}

		root.setNavigator(navigatorRef.current);
	}, [root]);

	return (
		<QueryClientProvider client={queryClient}>
			<NuqsReactAdapter>
				<AppContext.Provider value={root.app}>
					<DesignSystemProvider>
						<StorybookRuntimeBootstrap
							root={root}
							runtime={runtime}
							storyId={storyId}
						>
							{children}
						</StorybookRuntimeBootstrap>
					</DesignSystemProvider>
				</AppContext.Provider>
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
