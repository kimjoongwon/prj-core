import { DTO_CLASS_METADATA, DTO_IS_ARRAY_METADATA } from "@cocrepo/decorator";
import { ClassField, StringField } from "@cocrepo/decorator/field";
import { EntityResponseType } from "@cocrepo/dto";
import type { CallHandler, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { lastValueFrom, of } from "rxjs";
import { DtoTransformInterceptor } from "./dto-transform.interceptor";

class ExampleDto {
	id!: string;
	name!: string;
}

class FailingResponseEntity {
	@StringField() name!: string;
}
class FailingEntityResponseDto extends EntityResponseType(
	FailingResponseEntity,
	{
		pick: ["name"],
	},
) {
	constructor() {
		super();
		throw new Error("response conversion failed");
	}
}
class FailingOrdinaryDto {
	constructor() {
		throw new Error("legacy conversion failed");
	}
}
class FailingWrapperDto {
	@ClassField(() => FailingEntityResponseDto)
	user!: FailingEntityResponseDto;
}

describe("DtoTransformInterceptor", () => {
	let reflector: Reflector;
	let interceptor: DtoTransformInterceptor;

	beforeEach(() => {
		reflector = new Reflector();
		interceptor = new DtoTransformInterceptor(reflector);
	});

	const createExecutionContext = (
		handler: (...args: unknown[]) => unknown,
	): ExecutionContext =>
		({
			getHandler: () => handler,
		}) as unknown as ExecutionContext;

	it("transforms only the data field for plain response objects with meta", async () => {
		const handler = () => undefined;
		const context = createExecutionContext(handler);
		const callHandler: CallHandler = {
			handle: () =>
				of({
					data: [{ id: "1", name: "alpha" }],
					meta: { totalCount: 1 },
				}),
		};

		Reflect.defineMetadata(DTO_CLASS_METADATA, ExampleDto, handler);
		Reflect.defineMetadata(DTO_IS_ARRAY_METADATA, true, handler);

		const result = await lastValueFrom(
			interceptor.intercept(context, callHandler),
		);

		expect(result).toEqual({
			data: [expect.any(ExampleDto)],
			meta: { totalCount: 1 },
		});
	});

	it("Entity 응답 변환 실패 시 비공개 필드가 있는 원본을 반환하지 않는다", async () => {
		const handler = () => undefined;
		Reflect.defineMetadata(
			DTO_CLASS_METADATA,
			FailingEntityResponseDto,
			handler,
		);
		const response = interceptor.intercept(createExecutionContext(handler), {
			handle: () => of({ name: "관리자", password: "stored-hash" }),
		});

		await expect(lastValueFrom(response)).rejects.toThrow(
			"response conversion failed",
		);
	});

	it("일반 DTO의 기존 변환 실패 fallback은 유지한다", async () => {
		const handler = () => undefined;
		Reflect.defineMetadata(DTO_CLASS_METADATA, FailingOrdinaryDto, handler);
		const legacyResponse = { name: "기존 응답" };
		const response = interceptor.intercept(createExecutionContext(handler), {
			handle: () => of(legacyResponse),
		});

		await expect(lastValueFrom(response)).resolves.toBe(legacyResponse);
	});

	it("일반 wrapper의 중첩 Entity 응답 변환 실패도 원본을 반환하지 않는다", async () => {
		const handler = () => undefined;
		Reflect.defineMetadata(DTO_CLASS_METADATA, FailingWrapperDto, handler);
		const response = interceptor.intercept(createExecutionContext(handler), {
			handle: () => of({ user: { name: "관리자", password: "stored-hash" } }),
		});

		await expect(lastValueFrom(response)).rejects.toThrow(
			"response conversion failed",
		);
	});
});
