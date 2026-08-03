import { type DecimalId, isDecimalId } from "@cocrepo/type";
import { describe, expect, it } from "vitest";
import {
	mergeAdminPersistAccountSelection,
	mergeAdminPersistAuthSession,
	parseAdminPersistStorageDocument,
	readAdminPersistAccessToken,
	readAdminPersistSpaceSelection,
} from "./admin-persist";

function decimalIdFixture(value: string): DecimalId {
	if (!isDecimalId(value)) {
		throw new Error(`Invalid decimal ID fixture: ${value}`);
	}

	return value;
}

const oldTenantId = decimalIdFixture("101");
const oldSpaceId = decimalIdFixture("201");
const newTenantId = decimalIdFixture("102");
const newSpaceId = decimalIdFixture("202");

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
				tenantId: oldTenantId,
				spaceId: oldSpaceId,
				fitnessCenterName: "Old Fitness Center",
				contentLanguageCode: "en_US",
				availableSpaces: [
					{
						tenantId: oldTenantId,
						spaceId: oldSpaceId,
						fitnessCenterName: "Old Fitness Center",
						contentLanguageCode: "en_US",
					},
				],
			},
			authSession: nativeSession,
		});

		const document = mergeAdminPersistAccountSelection(raw, {
			tenantId: newTenantId,
			spaceId: newSpaceId,
			fitnessCenterName: "New Fitness Center",
			contentLanguageCode: "ko_KR",
		});

		expect(document.account).toEqual({
			version: 2,
			tenantId: newTenantId,
			spaceId: newSpaceId,
			fitnessCenterName: "New Fitness Center",
			contentLanguageCode: "ko_KR",
			availableSpaces: [
				{
					tenantId: newTenantId,
					spaceId: newSpaceId,
					fitnessCenterName: "New Fitness Center",
					contentLanguageCode: "ko_KR",
				},
				{
					tenantId: oldTenantId,
					spaceId: oldSpaceId,
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
				tenantId: oldTenantId,
				spaceId: oldSpaceId,
				legacyName: "Legacy Name",
				spaces: [],
			},
		});

		const document = mergeAdminPersistAccountSelection(raw, {
			tenantId: newTenantId,
			spaceId: newSpaceId,
			fitnessCenterName: "Current Fitness Center",
		});

		expect(document.account).toEqual({
			version: 2,
			tenantId: newTenantId,
			spaceId: newSpaceId,
			fitnessCenterName: "Current Fitness Center",
			contentLanguageCode: null,
			availableSpaces: [
				{
					tenantId: newTenantId,
					spaceId: newSpaceId,
					fitnessCenterName: "Current Fitness Center",
				},
			],
		});
	});

	it("Given 비정상 decimal ID fixture가 있을 때 When persist를 읽으면 Then 공용 validator 기준으로 선택값에서 제외한다", () => {
		const invalidDecimalIdFixture = "01";
		expect(isDecimalId(invalidDecimalIdFixture)).toBe(false);

		const raw = JSON.stringify({
			account: {
				version: 2,
				tenantId: invalidDecimalIdFixture,
				spaceId: newSpaceId,
				fitnessCenterName: "Invalid Fitness Center",
				contentLanguageCode: "ko_KR",
				availableSpaces: [
					{
						tenantId: invalidDecimalIdFixture,
						spaceId: newSpaceId,
						fitnessCenterName: "Invalid Fitness Center",
					},
				],
			},
		});

		const document = parseAdminPersistStorageDocument(raw);
		expect(document.account).toMatchObject({
			tenantId: null,
			spaceId: newSpaceId,
			availableSpaces: [],
		});
		expect(readAdminPersistSpaceSelection(raw)).toBeUndefined();
	});
});
