import {
	BadRequestException,
	InternalServerErrorException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService, NotBeforeError, TokenExpiredError } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import {
	createMockConfigService,
	createMockJwtService,
	createMockRequest,
	createMockResponse,
} from "../../test/test-utils";
import { Token, TokenService } from "./token.service";

describe("TokenService", () => {
	let service: TokenService;
	let jwtService: jest.Mocked<JwtService>;
	let configService: jest.Mocked<ConfigService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				TokenService,
				{
					provide: JwtService,
					useValue: createMockJwtService(),
				},
				{
					provide: ConfigService,
					useValue: createMockConfigService(),
				},
			],
		}).compile();

		service = module.get<TokenService>(TokenService);
		jwtService = module.get(JwtService);
		configService = module.get(ConfigService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("getTokenFromRequest", () => {
		it("should return access token when no key is provided", () => {
			const mockRequest = createMockRequest({
				cookies: {
					accessToken: "test-access-token",
				},
			});

			const result = service.getTokenFromRequest(mockRequest as any);

			expect(result).toBe("test-access-token");
		});

		it("should return specific token when key is provided", () => {
			const mockRequest = createMockRequest({
				cookies: {
					refreshToken: "test-refresh-token",
				},
			});

			const result = service.getTokenFromRequest(
				mockRequest as any,
				Token.REFRESH,
			);

			expect(result).toBe("test-refresh-token");
		});

		it("should throw BadRequestException when token is not found", () => {
			const mockRequest = createMockRequest({
				cookies: {},
			});

			expect(() => {
				service.getTokenFromRequest(mockRequest as any);
			}).toThrow(BadRequestException);
		});

		it("should throw BadRequestException when specific token is not found", () => {
			const mockRequest = createMockRequest({
				cookies: {
					accessToken: "test-access-token",
				},
			});

			expect(() => {
				service.getTokenFromRequest(mockRequest as any, Token.REFRESH);
			}).toThrow(BadRequestException);
		});
	});

	describe("setTokenToHTTPOnlyCookie", () => {
		it("should set cookie with httpOnly flag", () => {
			const mockResponse = createMockResponse();
			const tokenValue = "test-token-value";

			service.setTokenToHTTPOnlyCookie(
				mockResponse as any,
				Token.ACCESS,
				tokenValue,
			);

			expect(mockResponse.cookie).toHaveBeenCalledWith(
				Token.ACCESS,
				tokenValue,
				{
					httpOnly: true,
				},
			);
		});

		it("should set refresh token cookie", () => {
			const mockResponse = createMockResponse();
			const tokenValue = "test-refresh-token-value";

			service.setTokenToHTTPOnlyCookie(
				mockResponse as any,
				Token.REFRESH,
				tokenValue,
			);

			expect(mockResponse.cookie).toHaveBeenCalledWith(
				Token.REFRESH,
				tokenValue,
				{
					httpOnly: true,
				},
			);
		});
	});

	describe("generateAccessToken", () => {
		it("should generate access token with user payload", () => {
			const payload = { userId: "user-test-id" };
			const expectedToken = "generated-access-token";

			jwtService.sign = jest.fn().mockReturnValue(expectedToken);

			const result = service.generateAccessToken(payload);

			expect(jwtService.sign).toHaveBeenCalledWith(payload);
			expect(result).toBe(expectedToken);
		});
	});

	describe("generateRefreshToken", () => {
		it("should generate refresh token with custom expiration", () => {
			const payload = { userId: "user-test-id" };
			const expectedToken = "generated-refresh-token";
			const authConfig = { refresh: "7d" };

			configService.get = jest.fn().mockReturnValue(authConfig);
			jwtService.sign = jest.fn().mockReturnValue(expectedToken);

			const result = service.generateRefreshToken(payload);

			expect(configService.get).toHaveBeenCalledWith("auth");
			expect(jwtService.sign).toHaveBeenCalledWith(payload, {
				expiresIn: authConfig.refresh,
			});
			expect(result).toBe(expectedToken);
		});

		it("should generate refresh token with undefined expiration when config is missing", () => {
			const payload = { userId: "user-test-id" };
			const expectedToken = "generated-refresh-token";

			configService.get = jest.fn().mockReturnValue(null);
			jwtService.sign = jest.fn().mockReturnValue(expectedToken);

			const result = service.generateRefreshToken(payload);

			expect(configService.get).toHaveBeenCalledWith("auth");
			expect(jwtService.sign).toHaveBeenCalledWith(payload, {
				expiresIn: undefined,
			});
			expect(result).toBe(expectedToken);
		});
	});

	describe("generateTokens", () => {
		it("should generate both access and refresh tokens", () => {
			const payload = { userId: "user-test-id" };
			const accessToken = "generated-access-token";
			const refreshToken = "generated-refresh-token";

			jwtService.sign = jest
				.fn()
				.mockReturnValueOnce(accessToken)
				.mockReturnValueOnce(refreshToken);

			const result = service.generateTokens(payload);

			expect(result).toEqual({
				accessToken,
				refreshToken,
			});
		});
	});

	describe("validateToken", () => {
		it("should return payload for valid token", () => {
			const token = "valid-token";
			const expectedPayload = { userId: "user-test-id" };

			jwtService.verify = jest.fn().mockReturnValue(expectedPayload);

			const result = service.validateToken(token);

			expect(jwtService.verify).toHaveBeenCalledWith(token);
			expect(result).toEqual(expectedPayload);
		});

		it("should throw BadRequestException for expired token", () => {
			const token = "expired-token";

			jwtService.verify = jest.fn().mockImplementation(() => {
				throw new TokenExpiredError("Token expired", new Date());
			});

			expect(() => {
				service.validateToken(token);
			}).toThrow(BadRequestException);
		});

		it("should throw BadRequestException for not-before token", () => {
			const token = "not-before-token";

			jwtService.verify = jest.fn().mockImplementation(() => {
				throw new NotBeforeError("Token not before", new Date());
			});

			expect(() => {
				service.validateToken(token);
			}).toThrow(BadRequestException);
		});

		it("should throw InternalServerErrorException for unknown error", () => {
			const token = "invalid-token";

			jwtService.verify = jest.fn().mockImplementation(() => {
				throw new Error("Unknown error");
			});

			expect(() => {
				service.validateToken(token);
			}).toThrow(InternalServerErrorException);
		});
	});

	describe("verifyToken", () => {
		it("should return true for valid token", () => {
			const token = "valid-token";
			const expectedPayload = { userId: "user-test-id" };

			jwtService.verify = jest.fn().mockReturnValue(expectedPayload);

			const result = service.verifyToken(token);

			expect(result).toBe(true);
		});

		it("should return false for invalid token", () => {
			const token = "invalid-token";

			jwtService.verify = jest.fn().mockImplementation(() => {
				throw new Error("Invalid token");
			});

			const result = service.verifyToken(token);

			expect(result).toBe(false);
		});

		it("should return false for expired token", () => {
			const token = "expired-token";

			jwtService.verify = jest.fn().mockImplementation(() => {
				throw new TokenExpiredError("Token expired", new Date());
			});

			const result = service.verifyToken(token);

			expect(result).toBe(false);
		});

		it("should return false for not-before token", () => {
			const token = "not-before-token";

			jwtService.verify = jest.fn().mockImplementation(() => {
				throw new NotBeforeError("Token not before", new Date());
			});

			const result = service.verifyToken(token);

			expect(result).toBe(false);
		});
	});
});
