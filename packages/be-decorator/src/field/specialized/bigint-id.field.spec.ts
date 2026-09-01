import "reflect-metadata";
import { DECORATORS } from "@nestjs/swagger/dist/constants";
import { instanceToPlain, plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { describe, expect, it } from "vitest";
import { BigIntIdField, BigIntIdFieldOptional } from "./bigint-id.field";

class RequiredBigIntIdDto {
	/** 테스트용 bigint ID 필드 */
	@BigIntIdField()
	id!: bigint;
}

class OptionalBigIntIdDto {
	/** 테스트용 선택적 bigint ID 필드 */
	@BigIntIdFieldOptional()
	id?: bigint;
}

class NullableBigIntIdDto {
	/** 테스트용 nullable bigint ID 필드 */
	@BigIntIdField({ nullable: true })
	id!: bigint | null;
}

class BigIntIdArrayDto {
	/** 테스트용 bigint ID 배열 필드 */
	@BigIntIdField({ each: true })
	ids!: bigint[];
}

describe("BigIntIdField", () => {
	it("Given 요청 decimal 문자열 When DTO로 변환하면 Then bigint로 보관한다", () => {
		const dto = plainToInstance(RequiredBigIntIdDto, { id: "1" });

		expect(dto.id).toBe(1n);
		expect(validateSync(dto)).toHaveLength(0);
	});

	it("Given 응답 bigint 값 When plain object로 직렬화하면 Then decimal 문자열로 노출한다", () => {
		const dto = new RequiredBigIntIdDto();
		dto.id = 1n;

		expect(instanceToPlain(dto)).toEqual({ id: "1" });
	});

	it("Given canonical 규칙을 벗어난 입력 When 검증하면 Then 오류를 반환한다", () => {
		const invalidValues = [
			"0",
			"-1",
			"01",
			"1.0",
			"1e3",
			"1.2",
			"9223372036854775808",
		];

		for (const invalidValue of invalidValues) {
			const dto = plainToInstance(RequiredBigIntIdDto, { id: invalidValue });

			expect(validateSync(dto)).not.toHaveLength(0);
		}
	});

	it("Given 선택적 필드가 비어있을 때 When 검증하면 Then 통과한다", () => {
		const dto = plainToInstance(OptionalBigIntIdDto, {});

		expect(validateSync(dto)).toHaveLength(0);
	});

	it("Given nullable 또는 배열 입력 When DTO edge를 통과하면 Then null과 배열 bigint를 유지한다", () => {
		const nullableDto = plainToInstance(NullableBigIntIdDto, { id: null });
		const arrayDto = plainToInstance(BigIntIdArrayDto, {
			ids: ["1", "9223372036854775807"],
		});

		expect(nullableDto.id).toBeNull();
		expect(validateSync(nullableDto)).toHaveLength(0);
		expect(arrayDto.ids).toEqual([1n, 9223372036854775807n]);
		expect(validateSync(arrayDto)).toHaveLength(0);
		expect(instanceToPlain(arrayDto)).toEqual({
			ids: ["1", "9223372036854775807"],
		});
	});

	it("Given 필드 메타데이터 When Swagger 정보를 읽으면 Then string pattern과 bigint runtime 계약을 노출한다", () => {
		const metadata = Reflect.getMetadata(
			DECORATORS.API_MODEL_PROPERTIES,
			RequiredBigIntIdDto.prototype,
			"id",
		) as { pattern?: string; type?: string; "x-runtime-type"?: string };

		expect(metadata.type).toBe("string");
		expect(metadata["x-runtime-type"]).toBe("bigint");
		expect(metadata.pattern).toMatch(/^\^\(\?:/);
		expect(new RegExp(metadata.pattern ?? "").test("9223372036854775807")).toBe(
			true,
		);
		expect(new RegExp(metadata.pattern ?? "").test("9223372036854775808")).toBe(
			false,
		);

		const optionalMetadata = Reflect.getMetadata(
			DECORATORS.API_MODEL_PROPERTIES,
			OptionalBigIntIdDto.prototype,
			"id",
		) as { required?: boolean; "x-runtime-type"?: string };
		expect(optionalMetadata).toMatchObject({
			required: false,
			"x-runtime-type": "bigint",
		});

		const arrayMetadata = Reflect.getMetadata(
			DECORATORS.API_MODEL_PROPERTIES,
			BigIntIdArrayDto.prototype,
			"ids",
		) as {
			isArray?: boolean;
			type?: string;
			"x-runtime-type"?: string;
		};
		expect(arrayMetadata).toMatchObject({
			type: "string",
			isArray: true,
			"x-runtime-type": "bigint",
		});
	});
});
