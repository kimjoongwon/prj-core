import { ResponseEntity } from "@cocrepo/entity";
import { type CallHandler, HttpStatus } from "@nestjs/common";
import { lastValueFrom, of } from "rxjs";
import {
	BigIntResponseInterceptor,
	serializeResponseBigInts,
} from "./bigint-response.interceptor";

describe("BigIntResponseInterceptor", () => {
	it("Given 중첩된 bigint 응답 When 직렬화하면 Then 모든 bigint를 십진 문자열로 바꾼다", () => {
		const response = new ResponseEntity(HttpStatus.OK, "성공", {
			id: 1n,
			items: [{ userId: 2n }, 3n],
		});

		const result = serializeResponseBigInts(response) as ResponseEntity<{
			id: string;
			items: Array<{ userId: string } | string>;
		}>;

		expect(result).toBeInstanceOf(ResponseEntity);
		expect(result.data).toEqual({
			id: "1",
			items: [{ userId: "2" }, "3"],
		});
	});

	it("Given JSON 표현을 가진 값 When 직렬화하면 Then 해당 객체를 보존한다", () => {
		const createdAt = new Date("2026-08-02T00:00:00.000Z");
		const custom = { toJSON: () => "custom" };

		const result = serializeResponseBigInts({ createdAt, custom }) as {
			createdAt: Date;
			custom: typeof custom;
		};

		expect(result.createdAt).toBe(createdAt);
		expect(result.custom).toBe(custom);
	});

	it("Given bigint 응답 When interceptor를 통과하면 Then JSON 직렬화가 성공한다", async () => {
		const interceptor = new BigIntResponseInterceptor();
		const next: CallHandler = {
			handle: () => of({ id: 9223372036854775807n }),
		};

		const result = await lastValueFrom(
			interceptor.intercept({} as never, next),
		);

		expect(result).toEqual({ id: "9223372036854775807" });
		expect(() => JSON.stringify(result)).not.toThrow();
	});
});
