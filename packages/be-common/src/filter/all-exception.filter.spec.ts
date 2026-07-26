import { Prisma } from "@cocrepo/prisma";
import type { I18nTranslationService } from "@cocrepo/service";
import {
	type ArgumentsHost,
	HttpException,
	type HttpServer,
	HttpStatus,
	InternalServerErrorException,
	Logger,
} from "@nestjs/common";
import { BaseExceptionFilter, HttpAdapterHost } from "@nestjs/core";
import { AllExceptionsFilter } from "./all-exception.filter";

jest.mock("@cocrepo/service", () => {
	class TranslationService {
		translate = jest.fn(async (value: string) => value);
	}
	return {
		__esModule: true,
		TranslationService,
	};
});

describe("AllExceptionsFilter", () => {
	let filter: AllExceptionsFilter;
	let mockHttpAdapterHost: HttpAdapterHost;
	let loggerErrorSpy: jest.SpyInstance;
	let baseFilterCatchSpy: jest.SpyInstance;

	const createMockArgumentsHost = (
		request: Partial<{ url: string; method: string }> = {},
		response: unknown = {},
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
			switchToRpc: () => ({}),
			switchToWs: () => ({}),
			getType: () => "http",
		} as unknown as ArgumentsHost;
	};

	beforeEach(async () => {
		mockHttpAdapterHost = {
			httpAdapter: {
				reply: jest.fn(),
				getRequestUrl: jest.fn(),
				isHeadersSent: jest.fn().mockReturnValue(false),
			},
		} as unknown as HttpAdapterHost;

		const mockTranslationService = {
			translate: jest.fn().mockImplementation((key: string) => key),
		};

		filter = new AllExceptionsFilter(
			mockHttpAdapterHost.httpAdapter as unknown as HttpServer,
			mockTranslationService as unknown as I18nTranslationService,
		);

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
		it("P2022를 안전한 스키마 오류 응답으로 변환해야 한다", async () => {
			const exception = new Prisma.PrismaClientKnownRequestError(
				"The column does not exist",
				{
					code: "P2022",
					clientVersion: "test",
					meta: { column: "fitness_centers.space_id", query: "SELECT secret" },
				},
			);
			const host = createMockArgumentsHost({ url: "/api/v1/auth/login" });

			await filter.catch(exception, host);

			const [wrappedException] = baseFilterCatchSpy.mock.calls[0];
			expect(wrappedException.getStatus()).toBe(HttpStatus.SERVICE_UNAVAILABLE);
			expect(wrappedException.getResponse()).toMatchObject({
				httpStatus: HttpStatus.SERVICE_UNAVAILABLE,
				message:
					"서버 데이터베이스가 최신 상태가 아닙니다. 관리자에게 문의해 주세요.",
				data: {
					code: "P2022",
					target: "fitness_centers.space_id",
					retryable: false,
				},
			});
			expect(JSON.stringify(wrappedException.getResponse())).not.toContain(
				"SELECT secret",
			);
			expect(loggerErrorSpy).toHaveBeenCalledWith(
				expect.objectContaining({
					prisma: expect.objectContaining({
						code: "P2022",
						meta: {
							column: "fitness_centers.space_id",
							query: "SELECT secret",
						},
					}),
				}),
			);
		});

		it("P2002, P2003, P2025를 명시된 HTTP 상태로 변환해야 한다", async () => {
			const cases = [
				["P2002", HttpStatus.CONFLICT],
				["P2003", HttpStatus.BAD_REQUEST],
				["P2025", HttpStatus.NOT_FOUND],
			] as const;

			for (const [code, expectedStatus] of cases) {
				baseFilterCatchSpy.mockClear();
				await filter.catch(
					new Prisma.PrismaClientKnownRequestError("known error", {
						code,
						clientVersion: "test",
					}),
					createMockArgumentsHost(),
				);
				const [wrappedException] = baseFilterCatchSpy.mock.calls[0];
				expect(wrappedException.getStatus()).toBe(expectedStatus);
			}
		});

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
			};
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
