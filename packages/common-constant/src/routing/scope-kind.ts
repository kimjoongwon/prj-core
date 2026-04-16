import type { ScreenScopeKind } from "@cocrepo/type";

export function isScopeKindAccessible(
	scopeKind: ScreenScopeKind | undefined,
	hasFullAccessInCurrentTenant: boolean,
): boolean {
	if (scopeKind === "global-full-access-only") {
		return hasFullAccessInCurrentTenant;
	}

	return true;
}
