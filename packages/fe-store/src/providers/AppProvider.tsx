"use client";

import { setApiLocale, setApiSessionScope } from "@cocrepo/api/core/client";
import { setIdpLocale, setIdpSessionScope } from "@cocrepo/api/idp/client";
import type { AppProviderConfig } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect, useRef } from "react";
import { browserPersistStorageAdapter } from "../stores/persistence/persistStorage";
import { RootStore } from "../stores/rootStore";
import { AppContext } from "../stores/useApp";

export type { AppProviderConfig } from "@cocrepo/type";

/**
 * 공용 AppProvider가 앱별로 받는 설정과 하위 React 트리입니다.
 */
export interface AppProviderProps {
	children: ReactNode;
	config: AppProviderConfig;
}

/**
 * 앱마다 설정만 주입받아 단일 AppContext로 AppStore를 공급합니다.
 */
export const AppProvider = observer(function AppProvider({
	children,
	config,
}: AppProviderProps) {
	const rootRef = useRef<RootStore | null>(null);
	if (!rootRef.current) {
		const root = new RootStore({
			appName: config.appName,
			navItems: config.navItems,
			persistStorageKey: config.persistStorageKey,
			storageAdapter: browserPersistStorageAdapter,
		});

		root.initialize({
			sessionScopeBinders: [setApiSessionScope, setIdpSessionScope],
			languageBinders: [setApiLocale, setIdpLocale],
		});

		rootRef.current = root;
	}
	const root = rootRef.current;
	const router = useRouter();
	const pathname = usePathname();
	const previousPathnameRef = useRef(pathname);
	const language = root.app.language;

	// Persisted state hydrate는 첫 클라이언트 렌더 이후에만 수행하여
	// SSR/CSR 첫 렌더 트리를 동일하게 유지합니다.
	useEffect(() => {
		root.start();
	}, [root]);

	useEffect(() => {
		if (typeof document === "undefined") {
			return;
		}

		document.documentElement.lang = language.htmlLang;
	}, [language, language.htmlLang]);

	useEffect(() => {
		root.setRouter(router);
	}, [root, router]);

	useEffect(() => {
		if (previousPathnameRef.current !== pathname) {
			root.app.modal.dismiss();
		}
		previousPathnameRef.current = pathname;
		root.setCurrentPath(pathname);
	}, [pathname, root]);

	return <AppContext.Provider value={root.app}>{children}</AppContext.Provider>;
});
