/// <reference types="vite/client" />

import {
	AbilityStore,
	AuthStore,
	BottomTabStore,
	CookieStore,
	convertApiToAbilityRules,
	FABStore,
	NavigationStore,
	PersistStore,
	RootStore,
	RootStoreContext,
	TokenStore,
	usePersistStore,
} from "@cocrepo/store";
import { DesignSystemProvider } from "@cocrepo/ui";
import {
	isServer,
	QueryClient,
	QueryClientProvider,
	useQuery,
} from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import { NuqsReactAdapter } from "@cocrepo/hook/nuqs";
import type { PropsWithChildren, ReactNode } from "react";
import { useContext, useEffect, useRef, useState } from "react";
import {
	ADMIN_FAB_ACTIONS,
	ADMIN_NAV_ITEMS,
	BOTTOM_TAB_IDS,
	IDP_NAV_ITEMS,
} from "../../../../../packages/common-constant/src";
import type {
	AbilityApiResponse,
	AbilityRule,
	NavigatorLike,
} from "../../../../../packages/common-type/src";
import type { AbilityResponseDto } from "../../../../../packages/fe-api/src/core/abilities";
import {
	customInstance,
	setApiPersistStore,
	setLoginRedirectUrl,
} from "../../../../../packages/fe-api/src/core/client";
import {
	useGetCurrentSpace,
	useGetMySpaces,
	useSetCurrentSpace,
	useVerifyToken,
} from "../../../../../packages/fe-api/src/idp/auth";
import {
	setIdpLoginRedirectUrl,
	setIdpPersistStore,
} from "../../../../../packages/fe-api/src/idp/client";

declare const __STORYBOOK_REQUIRE_AUTH__: boolean;

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

const AUTH_LOGIN_PATH = "/__storybook_auth/login";
const AUTH_LOGOUT_PATH = "/__storybook_auth/logout";
const DEFAULT_STALE_TIME_MS = 60 * 1000;
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
			if (typeof window !== "undefined") {
				window.location.href = buildLogoutShellUrl(getTopLevelReturnTo());
			}
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

function getTopWindow(): Window | null {
	if (typeof window === "undefined") {
		return null;
	}

	try {
		return window.top ?? window;
	} catch {
		return window;
	}
}

function getTopLevelReturnTo(): string {
	const topWindow = getTopWindow();
	if (!topWindow) {
		return "/";
	}

	return `${topWindow.location.pathname}${topWindow.location.search}${topWindow.location.hash}`;
}

function buildLoginShellUrl(returnTo: string): string {
	return `${AUTH_LOGIN_PATH}?returnTo=${encodeURIComponent(returnTo)}`;
}

function buildLogoutShellUrl(returnTo: string): string {
	return `${AUTH_LOGOUT_PATH}?returnTo=${encodeURIComponent(returnTo)}`;
}

function redirectTopToLogin(): void {
	const topWindow = getTopWindow();
	if (!topWindow) {
		return;
	}

	topWindow.location.href = buildLoginShellUrl(getTopLevelReturnTo());
}

function getErrorStatus(error: unknown): number | null {
	if (!error || typeof error !== "object") {
		return null;
	}

	if ("response" in error) {
		const response = (error as { response?: { status?: number } }).response;
		if (typeof response?.status === "number") {
			return response.status;
		}
	}

	if ("status" in error) {
		const status = (error as { status?: number }).status;
		if (typeof status === "number") {
			return status;
		}
	}

	return null;
}

function getErrorMessage(error: unknown, fallback: string): string {
	if (error instanceof Error && error.message) {
		return error.message;
	}

	return fallback;
}

function mapSpaces(
	spaces: Array<{ id: string; ground?: { name?: string | null } | null }>,
): SpaceOption[] {
	return spaces.map((space) => ({
		spaceId: space.id,
		groundName: space.ground?.name ?? space.id,
	}));
}

function createAbilityRules(abilities: AbilityResponseDto[]): AbilityRule[] {
	const apiResponses: AbilityApiResponse[] = abilities.map((ability) => ({
		action: ability.action?.name,
		subject: ability.subject?.name,
		fields: ability.fields,
		conditions:
			(ability.conditions as Record<string, unknown> | null | undefined) ??
			undefined,
		inverted: ability.inverted,
		reason: ability.reason ?? undefined,
	}));

	return convertApiToAbilityRules(apiResponses);
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

function RuntimeScreen({
	title,
	description,
	tone = "default",
	actions,
}: {
	title: string;
	description: string;
	tone?: "default" | "error";
	actions?: ReactNode;
}) {
	return (
		<div className="min-h-[360px] bg-black text-white">
			<div className="fixed bottom-0 left-0 h-[360px] w-[360px] -translate-x-1/3 translate-y-1/3 rounded-full bg-warning/25 blur-3xl" />
			<div className="fixed right-0 top-0 h-[280px] w-[280px] translate-x-1/3 -translate-y-1/3 rounded-full bg-primary/20 blur-3xl" />
			<div className="relative mx-auto flex min-h-[360px] max-w-3xl items-center px-6 py-16">
				<div className="w-full rounded-3xl border border-white/10 bg-content1/90 p-8 shadow-2xl backdrop-blur">
					<div
						className={`mb-4 inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] ${
							tone === "error"
								? "border-danger/30 bg-danger/10 text-danger-300"
								: "border-warning/30 bg-warning/10 text-warning-300"
						}`}
					>
						plate storybook runtime
					</div>
					<h2 className="text-3xl font-bold">{title}</h2>
					<p className="mt-3 text-default-500">{description}</p>
					{actions ? (
						<div className="mt-6 flex flex-wrap gap-3">{actions}</div>
					) : null}
				</div>
			</div>
		</div>
	);
}

function LoadingIndicator({ label }: { label: string }) {
	return (
		<div className="inline-flex items-center gap-3 rounded-xl border border-warning/20 bg-warning/10 px-4 py-2 text-warning-300">
			<div className="h-2.5 w-2.5 animate-pulse rounded-full bg-warning" />
			<span className="text-sm font-semibold">{label}</span>
		</div>
	);
}

function useRootStore(): RootStore {
	const store = useContext(RootStoreContext);
	if (!store) {
		throw new Error("StorybookRuntimeProvider requires RootStoreContext.");
	}
	return store;
}

const AdminSpaceBar = observer(function AdminSpaceBar({
	isLiveAuthRuntime,
}: {
	isLiveAuthRuntime: boolean;
}) {
	const persistStore = usePersistStore();
	const { mutate: setCurrentSpaceMutate } = useSetCurrentSpace({
		mutation: {
			onSuccess: (response, variables) => {
				const currentSpace = response.data;
				const nextSpace = persistStore.spaces.find(
					(space) => space.spaceId === (currentSpace?.id ?? variables.spaceId),
				);
				if (nextSpace) {
					persistStore.setSpace(nextSpace.spaceId, nextSpace.groundName);
				}
			},
		},
	});

	if (
		!persistStore.isHydrated ||
		!persistStore.spaceId ||
		persistStore.spaces.length === 0
	) {
		return null;
	}

	if (persistStore.spaces.length === 1) {
		return (
			<div className="mb-4 flex items-center gap-3 rounded-2xl border border-default-200 bg-content1/90 px-4 py-3 shadow-sm backdrop-blur">
				<span className="text-xs font-semibold uppercase tracking-[0.18em] text-default-500">
					Admin Realm
				</span>
				<span className="text-sm font-medium text-foreground">
					{persistStore.groundName}
				</span>
			</div>
		);
	}

	return (
		<div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-default-200 bg-content1/90 px-4 py-3 shadow-sm backdrop-blur">
			<span className="text-xs font-semibold uppercase tracking-[0.18em] text-default-500">
				Admin Realm
			</span>
			<label
				className="text-sm text-default-600"
				htmlFor="storybook-space-select"
			>
				Space
			</label>
			<select
				id="storybook-space-select"
				className="min-w-[220px] rounded-xl border border-default-300 bg-content2 px-3 py-2 text-sm text-foreground"
				value={persistStore.spaceId}
				onChange={(event) => {
					const nextSpace = persistStore.spaces.find(
						(space) => space.spaceId === event.target.value,
					);
					if (!nextSpace) {
						return;
					}

					if (!isLiveAuthRuntime) {
						persistStore.setSpace(nextSpace.spaceId, nextSpace.groundName);
						return;
					}

					setCurrentSpaceMutate({ spaceId: nextSpace.spaceId });
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
	const isLiveAuthRuntime = __STORYBOOK_REQUIRE_AUTH__;

	const verifyQuery = useVerifyToken({
		query: {
			enabled: isLiveAuthRuntime && runtime.realm !== "none",
			retry: false,
			staleTime: DEFAULT_STALE_TIME_MS,
		},
	});

	const currentSpaceId =
		runtime.realm === "admin" ? (persistStore?.spaceId ?? null) : null;

	const mySpacesQuery = useGetMySpaces({
		query: {
			enabled:
				isLiveAuthRuntime &&
				runtime.realm === "admin" &&
				Boolean(verifyQuery.data?.data?.valid),
			retry: false,
			staleTime: DEFAULT_STALE_TIME_MS,
		},
	});

	const currentSpaceQuery = useGetCurrentSpace({
		query: {
			enabled:
				isLiveAuthRuntime &&
				runtime.realm === "admin" &&
				Boolean(verifyQuery.data?.data?.valid),
			retry: false,
			staleTime: DEFAULT_STALE_TIME_MS,
		},
	});

	const abilitiesQuery = useQuery({
		queryKey: ["storybook", "abilities", "my", currentSpaceId ?? "none"],
		queryFn: async () => {
			const response = await customInstance<{ data?: AbilityResponseDto[] }>({
				url: "/api/v1/abilities/my",
				method: "GET",
			});

			return response.data ?? [];
		},
		enabled:
			isLiveAuthRuntime &&
			runtime.realm === "admin" &&
			Boolean(verifyQuery.data?.data?.valid) &&
			Boolean(currentSpaceId),
		staleTime: DEFAULT_STALE_TIME_MS,
		retry: false,
	});

	useEffect(() => {
		if (!persistStore) {
			return;
		}

		persistStore.hydrateFromStorage();
		setApiPersistStore(persistStore);
		setIdpPersistStore(persistStore);
	}, [persistStore, storyId]);

	useEffect(() => {
		const loginUrl = buildLoginShellUrl(getTopLevelReturnTo());
		setLoginRedirectUrl(loginUrl);
		setIdpLoginRedirectUrl(loginUrl);
	}, [storyId]);

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
		if (!persistStore || !verifyQuery.data?.data?.valid) {
			return;
		}

		const tokenData = verifyQuery.data.data;
		if (!tokenData.accessTokenExpiresAt || !tokenData.refreshTokenExpiresAt) {
			return;
		}

		persistStore.setTokenExpiries(
			tokenData.accessTokenExpiresAt,
			tokenData.refreshTokenExpiresAt,
		);
	}, [persistStore, verifyQuery.data]);

	useEffect(() => {
		if (!persistStore || !abilityStore) {
			return;
		}

		if (!isLiveAuthRuntime) {
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
				const nextSpace =
					requestedSpace ?? persistedSpace ?? STATIC_ADMIN_SPACES[0];

				persistStore.setSpaces(STATIC_ADMIN_SPACES);
				persistStore.setSpace(nextSpace.spaceId, nextSpace.groundName);
			}
			abilityStore.updateRules([...FALLBACK_ABILITY_RULES]);
			return;
		}

		if (runtime.realm !== "admin") {
			abilityStore.updateRules([...FALLBACK_ABILITY_RULES]);
		}
	}, [abilityStore, isLiveAuthRuntime, persistStore, runtime.realm]);

	useEffect(() => {
		if (!persistStore || runtime.realm !== "admin" || !isLiveAuthRuntime) {
			return;
		}

		const spaces = mapSpaces(mySpacesQuery.data?.data ?? []);
		persistStore.setSpaces(spaces);

		if (spaces.length === 0) {
			persistStore.clearSpace();
			return;
		}

		const currentSpace = currentSpaceQuery.data?.data;
		const currentSelectedSpace = currentSpace?.id
			? spaces.find((space) => space.spaceId === currentSpace.id)
			: undefined;
		const requestedSpace = runtime.spaceId
			? spaces.find((space) => space.spaceId === runtime.spaceId)
			: undefined;
		const nextSpace = requestedSpace ?? currentSelectedSpace ?? spaces[0];

		persistStore.setSpace(nextSpace.spaceId, nextSpace.groundName);
	}, [
		currentSpaceQuery.data,
		isLiveAuthRuntime,
		mySpacesQuery.data,
		persistStore,
		runtime.realm,
		runtime.spaceId,
	]);

	useEffect(() => {
		if (!abilityStore) {
			return;
		}

		if (runtime.realm !== "admin" || !isLiveAuthRuntime) {
			return;
		}

		if (abilitiesQuery.isSuccess) {
			abilityStore.updateRules(createAbilityRules(abilitiesQuery.data));
			return;
		}

		if (abilitiesQuery.isError) {
			abilityStore.updateRules([...FALLBACK_ABILITY_RULES]);
		}
	}, [
		abilitiesQuery.data,
		abilitiesQuery.isError,
		abilitiesQuery.isSuccess,
		abilityStore,
		isLiveAuthRuntime,
		runtime.realm,
	]);

	const redirectStatus =
		getErrorStatus(verifyQuery.error) ??
		getErrorStatus(mySpacesQuery.error) ??
		getErrorStatus(abilitiesQuery.error);

	useEffect(() => {
		if (isLiveAuthRuntime && redirectStatus === 401) {
			redirectTopToLogin();
		}
	}, [isLiveAuthRuntime, redirectStatus]);

	if (isLiveAuthRuntime && runtime.realm !== "none" && verifyQuery.isLoading) {
		return (
			<RuntimeScreen
				title="Checking local Storybook session"
				description="The Storybook shell is verifying the existing IDP cookie session before rendering authenticated stories."
				actions={<LoadingIndicator label="Checking auth" />}
			/>
		);
	}

	if (isLiveAuthRuntime && runtime.realm !== "none" && verifyQuery.isError) {
		const unauthorized = getErrorStatus(verifyQuery.error) === 401;

		return (
			<RuntimeScreen
				title={
					unauthorized
						? "Storybook login required"
						: "Storybook auth check failed"
				}
				description={
					unauthorized
						? "Your local Storybook session expired. Re-authenticate through the Storybook login shell."
						: getErrorMessage(
								verifyQuery.error,
								"Storybook could not reach the local IDP API.",
							)
				}
				tone={unauthorized ? "default" : "error"}
				actions={
					<a
						href={buildLoginShellUrl(getTopLevelReturnTo())}
						className="rounded-xl border border-warning/30 bg-warning/10 px-4 py-2 font-semibold text-warning-300"
					>
						Open login shell
					</a>
				}
			/>
		);
	}

	if (
		runtime.realm === "admin" &&
		isLiveAuthRuntime &&
		mySpacesQuery.isLoading
	) {
		return (
			<RuntimeScreen
				title="Bootstrapping admin runtime"
				description="Storybook is hydrating admin spaces and runtime state before rendering this story."
				actions={<LoadingIndicator label="Loading spaces" />}
			/>
		);
	}

	if (
		runtime.realm === "admin" &&
		isLiveAuthRuntime &&
		mySpacesQuery.isError &&
		getErrorStatus(mySpacesQuery.error) !== 401
	) {
		return (
			<RuntimeScreen
				title="Failed to load admin spaces"
				description={getErrorMessage(
					mySpacesQuery.error,
					"The Storybook runtime could not load /api/v1/auth/my-spaces.",
				)}
				tone="error"
				actions={
					<a
						href={buildLogoutShellUrl(getTopLevelReturnTo())}
						className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-2 font-semibold text-danger-300"
					>
						Reset session
					</a>
				}
			/>
		);
	}

	if (
		runtime.realm === "admin" &&
		isLiveAuthRuntime &&
		currentSpaceId &&
		abilitiesQuery.isLoading
	) {
		return (
			<RuntimeScreen
				title="Applying admin abilities"
				description="Storybook is loading the current user's ability rules for the selected space."
				actions={<LoadingIndicator label="Loading abilities" />}
			/>
		);
	}

	if (
		runtime.realm === "admin" &&
		runtime.requiresSpace &&
		persistStore?.isHydrated &&
		!currentSpaceId
	) {
		return (
			<RuntimeScreen
				title="No accessible spaces found"
				description="Admin stories that require a selected Space need at least one accessible space from /api/v1/auth/my-spaces."
				tone="error"
				actions={
					<a
						href={buildLogoutShellUrl(getTopLevelReturnTo())}
						className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-2 font-semibold text-danger-300"
					>
						Reset session
					</a>
				}
			/>
		);
	}

	if (runtime.realm === "admin") {
		return (
			<div className="p-4">
				<AdminSpaceBar isLiveAuthRuntime={isLiveAuthRuntime} />
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
					<DesignSystemProvider
						navigate={(path) => {
							setCurrentPath(path);
						}}
					>
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
