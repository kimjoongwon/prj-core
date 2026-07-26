import { describe, expect, it } from "vitest";
import {
	mergeAdminPersistAccountSelection,
	mergeAdminPersistAuthSession,
	readAdminPersistAccessToken,
} from "./admin-persist";

const nativeSession = {
	accessToken: "access-token",
	refreshToken: "refresh-token",
	sessionId: "session-id",
	accessTokenExpiresAt: 1_000,
	refreshTokenExpiresAt: 2_000,
};

describe("admin persist contract", () => {
	it("Given 이전 root 필드가 있을 때 When native session을 합치면 Then authSession section만 사용한다", () => {
		const raw = JSON.stringify({
			accessToken: "legacy-token",
			legacyName: "Legacy Name",
			language: { code: "ko_KR" },
		});

		expect(readAdminPersistAccessToken(raw)).toBeUndefined();

		const document = mergeAdminPersistAuthSession(raw, nativeSession);

		expect(document).toEqual({
			authSession: nativeSession,
			language: { code: "ko_KR" },
		});
		expect(readAdminPersistAccessToken(JSON.stringify(document))).toBe(
			"access-token",
		);
	});

	it("Given 기존 version 2 선택이 있을 때 When FitnessCenter를 선택하면 Then account 계약을 갱신한다", () => {
		const raw = JSON.stringify({
			account: {
				version: 2,
				tenantId: "tenant-old",
				spaceId: "space-old",
				fitnessCenterName: "Old Fitness Center",
				contentLanguageCode: "en_US",
				availableSpaces: [
					{
						tenantId: "tenant-old",
						spaceId: "space-old",
						fitnessCenterName: "Old Fitness Center",
						contentLanguageCode: "en_US",
					},
				],
			},
			authSession: nativeSession,
		});

		const document = mergeAdminPersistAccountSelection(raw, {
			tenantId: "tenant-new",
			spaceId: "space-new",
			fitnessCenterName: "New Fitness Center",
			contentLanguageCode: "ko_KR",
		});

		expect(document.account).toEqual({
			version: 2,
			tenantId: "tenant-new",
			spaceId: "space-new",
			fitnessCenterName: "New Fitness Center",
			contentLanguageCode: "ko_KR",
			availableSpaces: [
				{
					tenantId: "tenant-new",
					spaceId: "space-new",
					fitnessCenterName: "New Fitness Center",
					contentLanguageCode: "ko_KR",
				},
				{
					tenantId: "tenant-old",
					spaceId: "space-old",
					fitnessCenterName: "Old Fitness Center",
					contentLanguageCode: "en_US",
				},
			],
		});
		expect(document.authSession).toEqual(nativeSession);
	});

	it("Given 이전 account section일 때 When 선택을 갱신하면 Then 호환 alias 없이 version 2로 교체한다", () => {
		const raw = JSON.stringify({
			account: {
				tenantId: "tenant-legacy",
				spaceId: "space-legacy",
				legacyName: "Legacy Name",
				spaces: [],
			},
		});

		const document = mergeAdminPersistAccountSelection(raw, {
			tenantId: "tenant-current",
			spaceId: "space-current",
			fitnessCenterName: "Current Fitness Center",
		});

		expect(document.account).toEqual({
			version: 2,
			tenantId: "tenant-current",
			spaceId: "space-current",
			fitnessCenterName: "Current Fitness Center",
			contentLanguageCode: null,
			availableSpaces: [
				{
					tenantId: "tenant-current",
					spaceId: "space-current",
					fitnessCenterName: "Current Fitness Center",
				},
			],
		});
	});
});
