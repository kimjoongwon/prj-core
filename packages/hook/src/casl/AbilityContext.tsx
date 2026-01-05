"use client";

import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
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
	refetch: undefined,
});

export interface AbilityProviderProps {
	children: ReactNode;
	/** 직접 전달하는 권한 규칙 */
	rules?: AbilityRule[];
	/** API에서 권한을 가져오는 함수 */
	fetchAbilities?: () => Promise<AbilityRule[]>;
	/** 인증되지 않은 경우 사용할 기본 규칙 */
	defaultRulesWhenUnauthenticated?: AbilityRule[];
}

/**
 * Ability Provider
 * CASL 권한 시스템을 제공합니다.
 *
 * 사용 방법:
 * 1. rules prop: 직접 권한 규칙을 전달
 * 2. fetchAbilities prop: API에서 권한을 가져오는 함수 전달
 *
 * @example
 * // 직접 규칙 전달
 * <AbilityProvider rules={[{ action: "MANAGE", subject: "all" }]}>
 *
 * // API 연동 (apps/admin에서)
 * const fetchAbilities = async () => {
 *   const { data } = await getMyAbilities();
 *   return convertApiToRules(data?.data ?? []);
 * };
 * <AbilityProvider fetchAbilities={fetchAbilities}>
 */
export function AbilityProvider({
	children,
	rules,
	fetchAbilities,
	defaultRulesWhenUnauthenticated,
}: AbilityProviderProps) {
	const [isLoading, setIsLoading] = useState(!!fetchAbilities);
	const [fetchedRules, setFetchedRules] = useState<AbilityRule[] | null>(null);

	const loadAbilities = useCallback(async () => {
		if (!fetchAbilities) return;

		setIsLoading(true);
		try {
			const abilities = await fetchAbilities();
			setFetchedRules(abilities);
		} catch (error) {
			console.error("Failed to fetch abilities:", error);
			setFetchedRules(defaultRulesWhenUnauthenticated ?? []);
		} finally {
			setIsLoading(false);
		}
	}, [fetchAbilities, defaultRulesWhenUnauthenticated]);

	useEffect(() => {
		if (fetchAbilities) {
			loadAbilities();
		}
	}, [fetchAbilities, loadAbilities]);

	const ability = useMemo(() => {
		// 우선순위: rules prop > fetchedRules > defaultRules
		const activeRules = rules ?? fetchedRules ?? defaultRules;
		return createAbility(activeRules);
	}, [rules, fetchedRules]);

	const refetch = useCallback(() => {
		if (fetchAbilities) {
			loadAbilities();
		}
	}, [fetchAbilities, loadAbilities]);

	const value = useMemo(
		() => ({
			ability,
			isLoading,
			refetch: fetchAbilities ? refetch : undefined,
		}),
		[ability, isLoading, refetch, fetchAbilities],
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

/**
 * Ability 새로고침 훅
 * fetchAbilities가 제공된 경우에만 사용 가능
 */
export function useAbilityRefetch(): (() => void) | undefined {
	const context = useContext(AbilityContext);
	return context.refetch;
}

export { createAbility };
