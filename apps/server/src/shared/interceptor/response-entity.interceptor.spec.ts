import {
	type CallHandler,
	type ExecutionContext,
	HttpStatus,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ResponseEntity } from "@shared/schema";
import { lastValueFrom, of } from "rxjs";
import { RESPONSE_MESSAGE_METADATA } from "../decorator/response-message.decorator";
import { wrapResponse } from "../util/response.util";
import { ResponseEntityInterceptor } from "./response-entity.interceptor";

// Placeholder imports - will be implemented in corresponding modules

describe("ResponseEntityInterceptor", () => {
	let reflector: Reflector;
	let interceptor: ResponseEntityInterceptor;

	beforeEach(() => {
		reflector = new Reflector();
		interceptor = new ResponseEntityInterceptor(reflector);
	});

	const createExecutionContext = (
		handler: (...args: any[]) => any,
		status: number = HttpStatus.OK,
	): ExecutionContext =>
		({
			getClass: () => ({ prototype: { handler } }),
			getHandler: () => handler,
			switchToHttp: () => ({
				getResponse: () => ({ statusCode: status }),
			}),
		}) as unknown as ExecutionContext;

	it("wraps plain data with default message and status", async () => {
		const handler = () => undefined;
		const context = createExecutionContext(handler, HttpStatus.OK);
		const callHandler: CallHandler = {
			handle: () => of({ id: "123" }),
		};

		const result = await lastValueFrom(
			interceptor.intercept(context, callHandler),
		);

		expect(result).toBeInstanceOf(ResponseEntity);
		expect(result).toEqual(
			new ResponseEntity(HttpStatus.OK, "성공", { id: "123" }),
		);
	});

	it("uses response message metadata when provided", async () => {
		const handler = () => undefined;
		const context = createExecutionContext(handler, HttpStatus.CREATED);
		const callHandler: CallHandler = {
			handle: () => of({ name: "test" }),
		};

		Reflect.defineMetadata(RESPONSE_MESSAGE_METADATA, "생성 완료", handler);

		const result = await lastValueFrom(
			interceptor.intercept(context, callHandler),
		);

		expect(result).toEqual(
			new ResponseEntity(HttpStatus.CREATED, "생성 완료", { name: "test" }),
		);
	});

	it("prefers explicit message and meta from wrapped response", async () => {
		const handler = () => undefined;
		const context = createExecutionContext(handler, HttpStatus.OK);
		const callHandler: CallHandler = {
			handle: () =>
				of(
					wrapResponse(
						{ items: [1, 2, 3] },
						{
							message: "목록 조회",
							status: HttpStatus.ACCEPTED,
							meta: { page: 1 },
						},
					),
				),
		};

		const result = await lastValueFrom(
			interceptor.intercept(context, callHandler),
		);

		expect(result).toEqual(
			new ResponseEntity(
				HttpStatus.ACCEPTED,
				"목록 조회",
				{ items: [1, 2, 3] },
				{
					page: 1,
				} as any,
			),
		);
	});

	it("does not double-wrap existing ResponseEntity", async () => {
		const handler = () => undefined;
		const context = createExecutionContext(handler, HttpStatus.OK);
		const entity = new ResponseEntity(HttpStatus.OK, "이미 래핑됨", {
			ok: true,
		});
		const callHandler: CallHandler = {
			handle: () => of(entity),
		};

		const result = await lastValueFrom(
			interceptor.intercept(context, callHandler),
		);

		expect(result).toBe(entity);
	});
});
