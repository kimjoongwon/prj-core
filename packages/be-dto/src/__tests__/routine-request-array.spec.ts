import "reflect-metadata";
import { ValidationPipe } from "@nestjs/common";
import { generateSchema, type SchemaObject } from "@nestjs/swagger";
import { describe, expect, it } from "vitest";
import { CreateRoutineActivityItemDto } from "../create/create-routine-activity-item.dto";
import { CreateRoutineDto } from "../create/create-routine/create-routine.dto";
import { UpdateRoutineDto } from "../update/update-routine.dto";

describe.each([
	CreateRoutineDto,
	UpdateRoutineDto,
])("%s 활동 입력 배열 계약", (RoutineRequestDto) => {
	const baseFields =
		RoutineRequestDto === CreateRoutineDto ? { name: "루틴", label: "RT" } : {};
	const validationPipe = new ValidationPipe({
		transform: true,
		whitelist: true,
		forbidNonWhitelisted: true,
	});
	const validateRoutineRequest = (activityFields: Record<string, unknown>) =>
		validationPipe.transform(
			{ ...baseFields, ...activityFields },
			{ type: "body", metatype: RoutineRequestDto },
		);

	it("선택적인 생성 항목 배열을 OpenAPI에 명시한다", () => {
		const schemas: Record<string, SchemaObject> = {};
		const schemaName = RoutineRequestDto.name;
		Object.assign(schemas, generateSchema(RoutineRequestDto, schemas).schemas);

		expect(schemas[schemaName]?.properties?.activities).toMatchObject({
			type: "array",
			items: { $ref: "#/components/schemas/CreateRoutineActivityItemDto" },
		});
		expect(schemas[schemaName]?.required ?? []).not.toContain("activities");
	});

	it("배열의 각 항목을 인스턴스로 변환하고 ID와 숫자를 검증한다", async () => {
		const routineRequest = await validateRoutineRequest({
			activities: [
				{ taskId: "1", order: "1" },
				{ taskId: "2", repetitions: "3" },
			],
		});

		expect(routineRequest.activities).toHaveLength(2);
		expect(routineRequest.activities[0]).toBeInstanceOf(
			CreateRoutineActivityItemDto,
		);
		expect(routineRequest.activities).toEqual([
			expect.objectContaining({ taskId: 1n, order: 1 }),
			expect.objectContaining({ taskId: 2n, repetitions: 3 }),
		]);
	});

	it("생략·빈 배열·기존 입력 정규화 동작을 유지한다", async () => {
		expect((await validateRoutineRequest({})).activities).toBeUndefined();
		expect(
			(await validateRoutineRequest({ activities: [] })).activities,
		).toEqual([]);
		expect(
			(await validateRoutineRequest({ activities: null })).activities,
		).toEqual([]);
		expect(
			(await validateRoutineRequest({ activities: { taskId: "3" } }))
				.activities,
		).toEqual([expect.objectContaining({ taskId: 3n })]);
	});

	it("필수 항목 ID 누락과 잘못된 ID를 거부한다", async () => {
		await expect(
			validateRoutineRequest({ activities: [{}] }),
		).rejects.toThrow();
		await expect(
			validateRoutineRequest({ activities: [{ taskId: "invalid" }] }),
		).rejects.toThrow();
	});
});
