"use client";

import {
	DEFAULT_LANGUAGE,
	LanguageCode,
	supportedLanguages,
} from "@cocrepo/constant";
import { observer } from "mobx-react-lite";
import {
	Children,
	cloneElement,
	createContext,
	isValidElement,
	type ReactElement,
	type ReactNode,
	useContext,
} from "react";

export type I18nMessages = Record<string, string>;

export interface I18nContextValue {
	languageCode: LanguageCode;
	messages: I18nMessages;
	t: (key: string, fallback?: string) => string;
}

export interface I18nProviderProps {
	languageCode?: string | null;
	messages?: I18nMessages | null;
	children: ReactNode;
}

const I18nContext = createContext<I18nContextValue>({
	languageCode: DEFAULT_LANGUAGE,
	messages: {},
	t: (key, fallback) => fallback ?? key,
});

function toLanguageCode(value?: string | null): LanguageCode {
	if (supportedLanguages.includes(value as LanguageCode)) {
		return value as LanguageCode;
	}

	return DEFAULT_LANGUAGE;
}

export const I18nProvider = observer(function I18nProvider({
	languageCode,
	messages,
	children,
}: I18nProviderProps) {
	const normalizedLanguageCode = toLanguageCode(languageCode);
	const safeMessages = messages ?? {};
	const translate = (key: string, fallback?: string) =>
		safeMessages[key] ?? fallback ?? key;

	return (
		<I18nContext.Provider
			value={{
				languageCode: normalizedLanguageCode,
				messages: safeMessages,
				t: translate,
			}}
		>
			{children}
		</I18nContext.Provider>
	);
});

export function useI18n(): I18nContextValue {
	return useContext(I18nContext);
}

export function useT(): I18nContextValue["t"] {
	return useI18n().t;
}

export function translateNode(
	node: ReactNode,
	t: I18nContextValue["t"],
): ReactNode {
	if (typeof node === "string") {
		return t(node);
	}

	if (Array.isArray(node)) {
		return node.map((child) => translateNode(child, t));
	}

	if (!isValidElement(node)) {
		return node;
	}

	const element = node as ReactElement<{ children?: ReactNode }>;
	if (!("children" in element.props)) {
		return node;
	}

	return cloneElement(element, {
		children: Children.map(element.props.children, (child) =>
			translateNode(child, t),
		),
	});
}
