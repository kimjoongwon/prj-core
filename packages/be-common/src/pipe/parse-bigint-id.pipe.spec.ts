import { BadRequestException } from "@nestjs/common";
import { ParseBigIntIdPipe } from "./parse-bigint-id.pipe";

describe("ParseBigIntIdPipe", () => {
	const pipe = new ParseBigIntIdPipe();

	it("Given 유효한 decimal ID 문자열 When 변환하면 Then bigint를 반환한다", () => {
		expect(pipe.transform("1")).toBe(1n);
		expect(pipe.transform("9223372036854775807")).toBe(9223372036854775807n);
	});

	it("Given canonical decimal ID 규칙을 벗어난 문자열 When 변환하면 Then 400 오류를 던진다", () => {
		expect(() => pipe.transform("0")).toThrow(BadRequestException);
		expect(() => pipe.transform("-1")).toThrow(BadRequestException);
		expect(() => pipe.transform("01")).toThrow(BadRequestException);
		expect(() => pipe.transform("1.0")).toThrow(BadRequestException);
		expect(() => pipe.transform("1e3")).toThrow(BadRequestException);
		expect(() => pipe.transform(" 1")).toThrow(BadRequestException);
		expect(() => pipe.transform("9223372036854775808")).toThrow(
			BadRequestException,
		);
	});
});
