"use client";

import {
	createContext,
	type ReactNode,
	useContext,
	useMemo,
	useState,
} from "react";
import type {
	AbilityActions,
	AbilityContextValue,
	AbilityRule,
	AppAbility,
} from "./types";

/**
 * 기본 Ability 생성
 * SUPER_ADMIN은 모든 권한을 가짐
 */
function createAbility(rules: AbilityRule[]): AppAbility {
	return {
		rules,
		can: (action: AbilityActions, subject: string) => {
			// MANAGE all 규칙이 있으면 모든 권한 허용
			const hasManageAll = rules.some(
				(rule) =>
					!rule.inverted &&
					(rule.action === "MANAGE" ||
						(Array.isArray(rule.action) && rule.action.includes("MANAGE"))) &&
					rule.subject === "all",
			);
			if (hasManageAll) return true;

			// 해당 subject에 대한 규칙 찾기
			for (const rule of rules) {
				const actions = Array.isArray(rule.action)
					? rule.action
					: [rule.action];
				const matchesAction =
					actions.includes(action) || actions.includes("MANAGE");
				const matchesSubject =
					rule.subject === subject || rule.subject === "all";

				if (matchesAction && matchesSubject) {
					return !rule.inverted;
				}
			}

			return false;
		},
		cannot: (action: AbilityActions, subject: string) => {
			const ability = createAbility(rules);
			return !ability.can(action, subject);
		},
	};
}

/**
 * 기본 규칙 (SUPER_ADMIN - 모든 권한)
 */
const defaultRules: AbilityRule[] = [{ action: "MANAGE", subject: "all" }];

const defaultAbility = createAbility(defaultRules);

const AbilityContext = createContext<AbilityContextValue>({
	ability: defaultAbility,
	isLoading: false,
});

export interface AbilityProviderProps {
	children: ReactNode;
	rules?: AbilityRule[];
}

/**
 * Ability Provider
 * CASL 권한 시스템을 제공합니다.
 */
export function AbilityProvider({ children, rules }: AbilityProviderProps) {
	const [isLoading] = useState(false);

	const ability = useMemo(() => {
		return createAbility(rules || defaultRules);
	}, [rules]);

	const value = useMemo(
		() => ({
			ability,
			isLoading,
		}),
		[ability, isLoading],
	);

	return (
		<AbilityContext.Provider value={value}>{children}</AbilityContext.Provider>
	);
}

/**
 * Ability 훅
 */
export function useAbility(): AppAbility {
	const context = useContext(AbilityContext);
	if (!context) {
		throw new Error("useAbility must be used within an AbilityProvider");
	}
	return context.ability;
}

/**
 * Ability 로딩 상태 훅
 */
export function useAbilityLoading(): boolean {
	const context = useContext(AbilityContext);
	return context.isLoading;
}

export { createAbility };
