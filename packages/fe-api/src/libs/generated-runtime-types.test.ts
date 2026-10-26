import { describe, expect, expectTypeOf, it, vi } from "vitest";
import type { CreateReservationDto } from "../core/model/createReservationDto";
import type { ReservationDto } from "../core/model/reservationDto";
import type { UserDto } from "../core/model/userDto";
import { getCurrentSpace, setCurrentSpace } from "../idp/auth/auth";
import type { setCurrentSpace as setLegacyCurrentSpace } from "../idp/auth/current-space";

const jsonResponse = (body: unknown, status = 200) =>
	new Response(JSON.stringify(body), {
		status,
		headers: { "Content-Type": "application/json" },
	});

describe("생성 SDK의 ULID·Date 런타임 계약", () => {
	it("생성된 요청·응답 타입과 기존 문자열 wrapper 계약을 일치시킨다", () => {
		expectTypeOf<UserDto["id"]>().toEqualTypeOf<string>();
		expectTypeOf<UserDto["createdAt"]>().toEqualTypeOf<Date>();
		expectTypeOf<UserDto["updatedAt"]>().toEqualTypeOf<Date | null>();
		expectTypeOf<UserDto["failedLoginAttempts"]>().toEqualTypeOf<number>();
		expectTypeOf<ReservationDto["id"]>().toEqualTypeOf<string>();
		expectTypeOf<CreateReservationDto["memo"]>().toEqualTypeOf<
			string | null | undefined
		>();
		expectTypeOf<ReservationDto["occurrenceStartAt"]>().toEqualTypeOf<Date>();
		expectTypeOf<CreateReservationDto["timelineId"]>().toEqualTypeOf<string>();
		expectTypeOf<ReservationDto["confirmedAt"]>().toEqualTypeOf<Date | null>();
		expectTypeOf<
			Parameters<typeof setCurrentSpace>[0]["tenantId"]
		>().toEqualTypeOf<string>();
		expectTypeOf<
			Parameters<typeof setLegacyCurrentSpace>[0]["tenantId"]
		>().toEqualTypeOf<string>();
	});

	it("생성 클라이언트가 문서의 ULID·시각 문자열을 그대로 반환한다", async () => {
		const fetchMock = vi.fn<typeof fetch>(async () =>
			jsonResponse({
				data: {
					id: "01JSPACE0000000000000000QA",
					createdAt: "2026-09-05T00:00:00.000Z",
					updatedAt: null,
				},
			}),
		);
		vi.stubGlobal("fetch", fetchMock);

		const response = await getCurrentSpace();

		expectTypeOf(response.data?.id).toEqualTypeOf<string | undefined>();
		expectTypeOf(response.data?.createdAt).toEqualTypeOf<Date | undefined>();
		expect(response.data?.id).toBe("01JSPACE0000000000000000QA");
		expect(response.data?.createdAt).toEqual(
			new Date("2026-09-05T00:00:00.000Z"),
		);
		expect(response.data?.updatedAt).toBeNull();
	});

	it("생성 클라이언트가 ULID 문자열을 그대로 전송한다", async () => {
		const fetchMock = vi.fn<typeof fetch>(async (_input, init) => {
			expect(JSON.parse(String(init?.body))).toEqual({
				tenantId: "01JTENANT00000000000000TA",
			});
			return jsonResponse({ data: null });
		});
		vi.stubGlobal("fetch", fetchMock);

		await setCurrentSpace({ tenantId: "01JTENANT00000000000000TA" });
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});
});
