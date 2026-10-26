import { describe, expect, expectTypeOf, it, vi } from "vitest";
import { getCurrentSpace, setCurrentSpace } from "../idp/auth/auth";
import type { setCurrentSpace as setLegacyCurrentSpace } from "../idp/auth/current-space";
import type { CreateSessionDto } from "../core/model/createSessionDto";
import type { InquiryParticipant } from "../core/model/inquiryParticipant";
import type { UserDto } from "../core/model/userDto";

const jsonResponse = (body: unknown, status = 200) =>
	new Response(JSON.stringify(body), {
		status,
		headers: { "Content-Type": "application/json" },
	});

describe("생성 SDK의 bigint·Date 런타임 계약", () => {
	it("생성된 요청·응답 타입과 기존 문자열 wrapper 계약을 구분한다", () => {
		expectTypeOf<UserDto["id"]>().toEqualTypeOf<bigint>();
		expectTypeOf<UserDto["createdAt"]>().toEqualTypeOf<Date>();
		expectTypeOf<UserDto["updatedAt"]>().toEqualTypeOf<Date | null>();
		expectTypeOf<UserDto["failedLoginAttempts"]>().toEqualTypeOf<number>();
		expectTypeOf<InquiryParticipant["id"]>().toEqualTypeOf<bigint>();
		expectTypeOf<InquiryParticipant["threadId"]>().toEqualTypeOf<
			bigint | null | undefined
		>();
		expectTypeOf<InquiryParticipant["joinedAt"]>().toEqualTypeOf<Date>();
		expectTypeOf<CreateSessionDto["timelineId"]>().toEqualTypeOf<bigint>();
		expectTypeOf<CreateSessionDto["startDateTime"]>().toEqualTypeOf<
			Date | null | undefined
		>();
		expectTypeOf<
			Parameters<typeof setCurrentSpace>[0]["tenantId"]
		>().toEqualTypeOf<bigint>();
		expectTypeOf<
			Parameters<typeof setLegacyCurrentSpace>[0]["tenantId"]
		>().toEqualTypeOf<string>();
	});

	it("생성 클라이언트가 문서의 ID·시각 문자열을 bigint·Date로 반환한다", async () => {
		const fetchMock = vi.fn<typeof fetch>(async () =>
			jsonResponse({
				data: {
					id: "9223372036854775807",
					createdAt: "2026-09-05T00:00:00.000Z",
					updatedAt: null,
				},
			}),
		);
		vi.stubGlobal("fetch", fetchMock);

		const response = await getCurrentSpace();

		expectTypeOf(response.data?.id).toEqualTypeOf<bigint | undefined>();
		expectTypeOf(response.data?.createdAt).toEqualTypeOf<Date | undefined>();
		expect(response.data?.id).toBe(9223372036854775807n);
		expect(response.data?.createdAt).toEqual(
			new Date("2026-09-05T00:00:00.000Z"),
		);
		expect(response.data?.updatedAt).toBeNull();
	});

	it("생성 클라이언트의 bigint 입력을 기존 JSON 문자열로 전송한다", async () => {
		const fetchMock = vi.fn<typeof fetch>(async (_input, init) => {
			expect(JSON.parse(String(init?.body))).toEqual({
				tenantId: "9223372036854775807",
			});
			return jsonResponse({ data: null });
		});
		vi.stubGlobal("fetch", fetchMock);

		await setCurrentSpace({ tenantId: 9223372036854775807n });
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});
});
