import { DTO_CLASS_METADATA, DTO_IS_ARRAY_METADATA } from "@cocrepo/decorator";
import type { CallHandler, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { lastValueFrom, of } from "rxjs";
import { DtoTransformInterceptor } from "./dto-transform.interceptor";

class ExampleDto {
	id!: string;
	name!: string;
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
});
