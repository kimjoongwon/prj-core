import { type DecimalId, isDecimalId } from "@cocrepo/type";
import { describe, expect, it } from "vitest";
import {
	type AdminSpaceApiRequestLike,
	bootstrapAdminSpaceSelection,
} from "./admin-space-bootstrap";

function decimalIdFixture(value: string): DecimalId {
	if (!isDecimalId(value)) {
		throw new Error(`Invalid decimal ID fixture: ${value}`);
	}

	return value;
}

function response(status: number, payload: unknown) {
	return {
		status: () => status,
		json: async () => payload,
	};
}

describe("Admin Space bootstrap contract", () => {
	it("Given native login token과 Space bootstrap 응답이 있을 때 When current-space를 선택하면 Then 응답의 decimal ID를 그대로 반환한다", async () => {
		const tenantId = decimalIdFixture("301");
		const spaceId = decimalIdFixture("401");
		const calls: Array<{ url: string; options?: unknown }> = [];
		const request: AdminSpaceApiRequestLike = {
			get: async (url, options) => {
				calls.push({ url, options });
				return response(200, {
					data: [
						{
							id: decimalIdFixture("402"),
							tenantId: decimalIdFixture("302"),
							fitnessCenter: { name: "다른 센터" },
						},
						{
							id: spaceId,
							tenantId,
							contentLanguageCode: "ko_KR",
							fitnessCenter: { name: "플랫폼 운영본부" },
						},
					],
				});
			},
			post: async (url, options) => {
				calls.push({ url, options });
				return response(200, {
					data: {
						id: spaceId,
						tenantId,
						contentLanguageCode: "ko_KR",
						fitnessCenter: { name: "플랫폼 운영본부" },
					},
				});
			},
		};

		const selection = await bootstrapAdminSpaceSelection(request, {
			apiBaseUrl: "http://localhost:3000",
			accessToken: "native-access-token",
		});

		expect(selection).toEqual({
			tenantId,
			spaceId,
			fitnessCenterName: "플랫폼 운영본부",
			contentLanguageCode: "ko_KR",
		});
		expect(calls).toEqual([
			{
				url: "http://localhost:3000/api/v1/auth/my-spaces",
				options: {
					headers: { Authorization: "Bearer native-access-token" },
				},
			},
			{
				url: "http://localhost:3000/api/v1/auth/current-space",
				options: {
					data: { tenantId },
					headers: { Authorization: "Bearer native-access-token" },
				},
			},
		]);
	});

	it("Given bootstrap에 비정상 decimal ID fixture가 있을 때 When Space를 선택하면 Then 공용 validator 기준으로 거부한다", async () => {
		const invalidDecimalIdFixture = "01";
		expect(isDecimalId(invalidDecimalIdFixture)).toBe(false);
		const request: AdminSpaceApiRequestLike = {
			get: async () =>
				response(200, {
					data: [
						{
							id: decimalIdFixture("501"),
							tenantId: invalidDecimalIdFixture,
							fitnessCenter: { name: "플랫폼 운영본부" },
						},
					],
				}),
			post: async () => {
				throw new Error("current-space must not be called");
			},
		};

		await expect(
			bootstrapAdminSpaceSelection(request, {
				apiBaseUrl: "http://localhost:3000",
				accessToken: "native-access-token",
			}),
		).rejects.toThrow(
			"Admin Space bootstrap returned a non-canonical decimal ID.",
		);
	});
});
