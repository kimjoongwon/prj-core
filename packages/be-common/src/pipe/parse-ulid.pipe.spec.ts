import { BadRequestException } from "@nestjs/common";
import { ParseUlidPipe } from "./parse-ulid.pipe";

describe("ParseUlidPipe", () => {
	const pipe = new ParseUlidPipe();

	it("Given 유효한 ULID When 변환하면 Then 원래 값을 반환한다", () => {
		const ulid = "01J00000000000000000000000";

		expect(pipe.transform(ulid)).toBe(ulid);
	});

	it("Given UUID 또는 잘못된 문자열 When 변환하면 Then 400 오류를 던진다", () => {
		expect(() =>
			pipe.transform("123e4567-e89b-12d3-a456-426614174000"),
		).toThrow(BadRequestException);
		expect(() => pipe.transform("not-an-id")).toThrow(BadRequestException);
	});
});
