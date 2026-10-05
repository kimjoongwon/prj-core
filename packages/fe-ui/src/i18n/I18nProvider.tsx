"use client";

import { DEFAULT_LANGUAGE, type LanguageCode } from "@cocrepo/constant";
import { observer } from "mobx-react-lite";
import {
	Children,
	cloneElement,
	createContext,
	isValidElement,
	type ReactNode,
	useContext,
} from "react";

export type I18nMessages = Record<string, string>;
export type TranslationValues = Record<string, string | number>;
export type Translate = (
	key: string,
	fallback?: string,
	values?: TranslationValues,
) => string;

export interface I18nContextValue {
	languageCode: LanguageCode;
	messages: I18nMessages;
	t: Translate;
}

export interface I18nProviderProps {
	languageCode: LanguageCode;
	messages?: I18nMessages;
	children: ReactNode;
}

const fallbackContext: I18nContextValue = {
	languageCode: DEFAULT_LANGUAGE,
	messages: {},
	t: (key, fallback, values) => interpolateTranslation(fallback ?? key, values),
};

const I18nContext = createContext<I18nContextValue>(fallbackContext);

export const I18nProvider = observer(function I18nProvider({
	languageCode,
	messages = {},
	children,
}: I18nProviderProps) {
	const t: Translate = (key, fallback, values) =>
		interpolateTranslation(messages[key] ?? fallback ?? key, values);

	return (
		<I18nContext.Provider value={{ languageCode, messages, t }}>
			{children}
		</I18nContext.Provider>
	);
});

export function useI18n(): I18nContextValue {
	return useContext(I18nContext);
}

export function useT(): Translate {
	return useI18n().t;
}

export function translateNode(node: ReactNode, t: Translate): ReactNode {
	if (typeof node === "string") {
		return translateTextNode(node, t);
	}

	if (Array.isArray(node)) {
		return Children.map(node, (child) => translateNode(child, t));
	}

	if (isValidElement<{ children?: ReactNode }>(node)) {
		const children = node.props.children;

		if (children === undefined) {
			return node;
		}

		return cloneElement(node, undefined, translateNode(children, t));
	}

	return node;
}

function translateTextNode(text: string, t: Translate): string {
	const key = text.replace(/\s+/g, " ").trim();

	if (!key) {
		return text;
	}

	const leading = text.match(/^\s*/)?.[0] ?? "";
	const trailing = text.match(/\s*$/)?.[0] ?? "";

	return `${leading}${t(key)}${trailing}`;
}

function interpolateTranslation(
	text: string,
	values?: TranslationValues,
): string {
	if (!values) {
		return text;
	}

	return text.replace(/\{\{(\w+)\}\}/g, (match, key: string) => {
		const value = values[key];
		return value === undefined ? match : String(value);
	});
}
