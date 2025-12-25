import {
	ArgumentsHost,
	HttpException,
	HttpStatus,
	InternalServerErrorException,
	Logger,
} from "@nestjs/common";
import { BaseExceptionFilter, HttpAdapterHost } from "@nestjs/core";
import { Test, TestingModule } from "@nestjs/testing";
import { AllExceptionsFilter } from "./all-exception.filter";

describe("AllExceptionsFilter", () => {
	let filter: AllExceptionsFilter;
	let mockHttpAdapterHost: HttpAdapterHost;
	let loggerErrorSpy: jest.SpyInstance;
	let baseFilterCatchSpy: jest.SpyInstance;

	const createMockArgumentsHost = (
		request: Partial<{ url: string; method: string }> = {},
		response: any = {},
	): ArgumentsHost => {
		return {
			switchToHttp: () => ({
				getRequest: () => ({
					url: request.url || "/api/test",
					method: request.method || "GET",
				}),
				getResponse: () => response,
				getNext: () => jest.fn(),
			}),
			getArgs: () => [],
			getArgByIndex: () => ({}),
			switchToRpc: () => ({}) as any,
			switchToWs: () => ({}) as any,
			getType: () => "http" as any,
		} as ArgumentsHost;
	};

	beforeEach(async () => {
		mockHttpAdapterHost = {
			httpAdapter: {
				reply: jest.fn(),
				getRequestUrl: jest.fn(),
			},
		} as any;

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AllExceptionsFilter,
				{ provide: HttpAdapterHost, useValue: mockHttpAdapterHost },
			],
		}).compile();

		filter = module.get<AllExceptionsFilter>(AllExceptionsFilter);

		// Logger.error 모킹
		loggerErrorSpy = jest.spyOn(Logger.prototype, "error").mockImplementation();

		// BaseExceptionFilter.catch 모킹으로 에러 방지
		baseFilterCatchSpy = jest
			.spyOn(BaseExceptionFilter.prototype, "catch")
			.mockImplementation();
	});

	afterEach(() => {
		loggerErrorSpy.mockRestore();
		baseFilterCatchSpy.mockRestore();
	});

	it("필터가 정의되어야 한다", () => {
		expect(filter).toBeDefined();
	});

	describe("catch", () => {
		it("HttpException을 처리하고 super.catch를 호출해야 한다", () => {
			// Given
			const exception = new HttpException(
				"Bad Request",
				HttpStatus.BAD_REQUEST,
			);
			const mockResponse = {};
			const host = createMockArgumentsHost({ url: "/api/test" }, mockResponse);

			// When
			filter.catch(exception, host);

			// Then
			expect(baseFilterCatchSpy).toHaveBeenCalled();
			const [wrappedException] = baseFilterCatchSpy.mock.calls[0];
			expect(wrappedException).toBeInstanceOf(HttpException);
			expect(wrappedException.getStatus()).toBe(HttpStatus.BAD_REQUEST);
		});

		it("InternalServerErrorException을 처리해야 한다", () => {
			// Given
			const exception = new InternalServerErrorException("Server error");
			const mockResponse = {};
			const host = createMockArgumentsHost({ url: "/api/test" }, mockResponse);

			// When
			filter.catch(exception, host);

			// Then
			expect(baseFilterCatchSpy).toHaveBeenCalled();
			const [wrappedException] = baseFilterCatchSpy.mock.calls[0];
			expect(wrappedException.getStatus()).toBe(
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		});

		it("에러 정보를 Logger를 통해 로깅해야 한다", () => {
			// Given
			const exception = new HttpException("Not Found", HttpStatus.NOT_FOUND);
			const host = createMockArgumentsHost(
				{ url: "/api/users", method: "GET" },
				{},
			);

			// When
			filter.catch(exception, host);

			// Then
			expect(loggerErrorSpy).toHaveBeenCalledWith(
				expect.objectContaining({
					message: "Not Found",
					status: HttpStatus.NOT_FOUND,
					path: "/api/users",
					method: "GET",
				}),
			);
		});

		it("객체 형태의 응답을 ResponseEntity로 래핑해야 한다", () => {
			// Given
			const errorResponse = {
				statusCode: 400,
				message: ["email must be valid"],
				error: "Bad Request",
			};
			const exception = new HttpException(
				errorResponse,
				HttpStatus.BAD_REQUEST,
			);
			const host = createMockArgumentsHost({ url: "/api/test" }, {});

			// When
			filter.catch(exception, host);

			// Then
			expect(baseFilterCatchSpy).toHaveBeenCalled();
			const [wrappedException] = baseFilterCatchSpy.mock.calls[0];
			const response = wrappedException.getResponse();
			expect(response.httpStatus).toBe(HttpStatus.BAD_REQUEST);
			expect(response.data).toEqual(errorResponse);
		});

		it("문자열 형태의 응답은 data를 null로 설정해야 한다", () => {
			// Given
			const exception = new HttpException(
				"Simple error message",
				HttpStatus.BAD_REQUEST,
			);
			const host = createMockArgumentsHost({ url: "/api/test" }, {});

			// When
			filter.catch(exception, host);

			// Then
			expect(baseFilterCatchSpy).toHaveBeenCalled();
			const [wrappedException] = baseFilterCatchSpy.mock.calls[0];
			const response = wrappedException.getResponse();
			expect(response.data).toBeNull();
		});

		it("getStatus 메서드가 없는 예외는 500 상태 코드로 처리해야 한다", () => {
			// Given
			const exception = {
				message: "Unknown error",
			} as any;
			const host = createMockArgumentsHost({ url: "/api/test" }, {});

			// When
			filter.catch(exception, host);

			// Then
			expect(baseFilterCatchSpy).toHaveBeenCalled();
			const [wrappedException] = baseFilterCatchSpy.mock.calls[0];
			expect(wrappedException.getStatus()).toBe(
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		});

		it("로그에 timestamp가 포함되어야 한다", () => {
			// Given
			const exception = new HttpException("Test error", HttpStatus.BAD_REQUEST);
			const host = createMockArgumentsHost({ url: "/api/test" }, {});

			// When
			filter.catch(exception, host);

			// Then
			expect(loggerErrorSpy).toHaveBeenCalledWith(
				expect.objectContaining({
					timestamp: expect.any(String),
				}),
			);
		});
	});
});
