import { validateSync } from "class-validator";
import { describe, expect, it } from "vitest";
import { DecimalId } from "./decimal-id.decorator";

class DecimalIdFixture {
	/** 테스트 대상 숫자 ID입니다. */
	@DecimalId()
	id!: string;
}

describe("DecimalId", () => {
	it.each([
		"1",
		"9223372036854775807",
	])("Given 허용 범위의 decimal ID %s When 검증하면 Then 통과한다", (id) => {
		const fixture = new DecimalIdFixture();
		fixture.id = id;

		expect(validateSync(fixture)).toHaveLength(0);
	});

	it.each([
		"0",
		"-1",
		"01",
		"1.2",
		"1e3",
		"9223372036854775808",
	])("Given 비정상 decimal ID %s When 검증하면 Then 거부한다", (id) => {
		const fixture = new DecimalIdFixture();
		fixture.id = id;

		expect(validateSync(fixture)).not.toHaveLength(0);
	});
});
