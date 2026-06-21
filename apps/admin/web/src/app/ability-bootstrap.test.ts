import type { AbilityResponseDto } from "@cocrepo/api/core/abilities";
import { describe, expect, it } from "vitest";
import { resolveAbilityBootstrapRules } from "./ability-bootstrap";

const createAbility = (
	overrides: Partial<AbilityResponseDto> = {},
): AbilityResponseDto =>
	({
		id: "ability-1",
		actionId: "action-1",
		action: { name: "access" },
		subjectId: "subject-1",
		subject: { name: "menu:dashboard" },
		fields: [],
		inverted: false,
		name: "access_menu_dashboard",
		createdAt: "2026-05-01T00:00:00.000Z",
		...overrides,
	}) as AbilityResponseDto;

describe("resolveAbilityBootstrapRules", () => {
	it("PLATFORM_ADMIN이면 abilities 응답이 비어 있어도 manage all rule을 반환해야 한다", () => {
		const rules = resolveAbilityBootstrapRules({
			abilities: [],
			hasFullAccess: true,
			isAbilityLoading: false,
			isAbilityError: false,
			isTokenVerificationPending: false,
		});

		expect(rules).toEqual([{ action: "manage", subject: "all" }]);
	});

	it("토큰 검증 중에는 기존 AbilityStore rules를 덮어쓰지 않도록 null을 반환해야 한다", () => {
		const rules = resolveAbilityBootstrapRules({
			abilities: [],
			hasFullAccess: false,
			isAbilityLoading: false,
			isAbilityError: false,
			isTokenVerificationPending: true,
		});

		expect(rules).toBeNull();
	});

	it("일반 권한 사용자의 빈 abilities 응답은 빈 rules로 반영해야 한다", () => {
		const rules = resolveAbilityBootstrapRules({
			abilities: [],
			hasFullAccess: false,
			isAbilityLoading: false,
			isAbilityError: false,
			isTokenVerificationPending: false,
		});

		expect(rules).toEqual([]);
	});

	it("일반 권한 사용자는 API abilities를 AbilityStore rules로 변환해야 한다", () => {
		const rules = resolveAbilityBootstrapRules({
			abilities: [createAbility()],
			hasFullAccess: false,
			isAbilityLoading: false,
			isAbilityError: false,
			isTokenVerificationPending: false,
		});

		expect(rules).toEqual([
			{
				action: "view",
				subject: "menu:dashboard",
				fields: [],
				conditions: undefined,
				inverted: false,
				reason: undefined,
			},
		]);
	});
});
