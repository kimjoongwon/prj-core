import { CONTEXT_KEYS } from "@cocrepo/constant";
import { LoginPayloadDto, SignUpPayloadDto, UserDto } from "@cocrepo/dto";
import { User } from "@cocrepo/entity";
import { AuthFacade } from "@cocrepo/facade";
import { TokenService } from "@cocrepo/service";
import { UnauthorizedException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { ClsService } from "nestjs-cls";
import { AuthController } from "./auth.controller";

describe("AuthController", () => {
	let controller: AuthController;
	let mockAuthFacade: jest.Mocked<AuthFacade>;
	let mockTokenService: jest.Mocked<TokenService>;
	let mockClsService: jest.Mocked<ClsService>;

	const mockUser = {
		id: "user-test-id",
		email: "test@example.com",
		name: "Test User",
		tenants: [
			{
				id: "tenant-test-id",
				main: true,
				spaceId: "space-test-id",
			},
		],
	};

	const mockResponse = {
		cookie: jest.fn().mockReturnThis(),
		clearCookie: jest.fn().mockReturnThis(),
	};

	const mockRequest = {
		cookies: {
			accessToken: "test-access-token",
			refreshToken: "test-refresh-token",
		},
		user: mockUser,
	};

	beforeEach(async () => {
		mockAuthFacade = {
			login: jest.fn(),
			signUp: jest.fn(),
			getNewToken: jest.fn(),
			getCurrentUser: jest.fn(),
			logout: jest.fn(),
		} as any;

		mockTokenService = {
			setAccessTokenCookie: jest.fn(),
			setRefreshTokenCookie: jest.fn(),
			clearTokenCookies: jest.fn(),
			verifyToken: jest.fn(),
		} as any;

		mockClsService = {
			get: jest.fn(),
			set: jest.fn(),
		} as any;

		const module: TestingModule = await Test.createTestingModule({
			controllers: [AuthController],
			providers: [
				{ provide: AuthFacade, useValue: mockAuthFacade },
				{ provide: TokenService, useValue: mockTokenService },
				{ provide: ClsService, useValue: mockClsService },
			],
		}).compile();

		controller = module.get<AuthController>(AuthController);
	});

	it("컨트롤러가 정의되어야 한다", () => {
		expect(controller).toBeDefined();
	});

	describe("login", () => {
		it("로그인이 성공하면 토큰을 반환해야 한다", async () => {
			// Given
			const loginDto: LoginPayloadDto = {
				email: "test@example.com",
				password: "password123",
			};
			mockAuthFacade.login.mockResolvedValue({
				accessToken: "access-token",
				refreshToken: "refresh-token",
				user: mockUser as any,
			});

			// When
			const result = await controller.login(loginDto, mockResponse as any);

			// Then
			expect(mockAuthFacade.login).toHaveBeenCalledWith(loginDto);
			expect(mockTokenService.setAccessTokenCookie).toHaveBeenCalledWith(
				mockResponse,
				"access-token",
			);
			expect(mockTokenService.setRefreshTokenCookie).toHaveBeenCalledWith(
				mockResponse,
				"refresh-token",
			);
			expect(result.accessToken).toBe("access-token");
			expect(result.refreshToken).toBe("refresh-token");
			expect(result.mainTenantId).toBe("tenant-test-id");
		});

		it("메인 테넌트가 없으면 빈 문자열을 반환해야 한다", async () => {
			// Given
			const loginDto: LoginPayloadDto = {
				email: "test@example.com",
				password: "password123",
			};
			const userWithoutMainTenant = {
				...mockUser,
				tenants: [{ id: "tenant-id", main: false }],
			};
			mockAuthFacade.login.mockResolvedValue({
				accessToken: "access-token",
				refreshToken: "refresh-token",
				user: userWithoutMainTenant as any,
			});

			// When
			const result = await controller.login(loginDto, mockResponse as any);

			// Then
			expect(result.mainTenantId).toBe("");
		});
	});

	describe("refreshToken", () => {
		it("리프레시 토큰이 있으면 새 토큰을 발급해야 한다", async () => {
			// Given
			mockAuthFacade.getNewToken.mockResolvedValue({
				newAccessToken: "new-access-token",
				newRefreshToken: "new-refresh-token",
			});
			mockAuthFacade.getCurrentUser.mockResolvedValue(mockUser as any);

			// When
			const result = await controller.refreshToken(
				mockRequest as any,
				mockResponse as any,
			);

			// Then
			expect(mockAuthFacade.getNewToken).toHaveBeenCalledWith(
				"test-refresh-token",
			);
			expect(mockTokenService.setAccessTokenCookie).toHaveBeenCalledWith(
				mockResponse,
				"new-access-token",
			);
			expect(result.accessToken).toBe("new-access-token");
		});

		it("리프레시 토큰이 없으면 UnauthorizedException을 던져야 한다", async () => {
			// Given
			const requestWithoutToken = { cookies: {} };

			// When & Then
			await expect(
				controller.refreshToken(
					requestWithoutToken as any,
					mockResponse as any,
				),
			).rejects.toThrow(UnauthorizedException);
		});

		it("사용자를 찾을 수 없으면 UnauthorizedException을 던져야 한다", async () => {
			// Given
			mockAuthFacade.getNewToken.mockResolvedValue({
				newAccessToken: "new-access-token",
				newRefreshToken: "new-refresh-token",
			});
			mockAuthFacade.getCurrentUser.mockResolvedValue(null);

			// When & Then
			await expect(
				controller.refreshToken(mockRequest as any, mockResponse as any),
			).rejects.toThrow(UnauthorizedException);
		});
	});

	describe("getNewToken", () => {
		it("인증된 사용자의 토큰을 갱신해야 한다", async () => {
			// Given
			mockAuthFacade.getNewToken.mockResolvedValue({
				newAccessToken: "new-access-token",
				newRefreshToken: "new-refresh-token",
			});

			// When
			const result = await controller.getNewToken(
				mockRequest as any,
				mockResponse as any,
			);

			// Then
			expect(mockClsService.set).toHaveBeenCalledWith("hi", "hi");
			expect(mockTokenService.setAccessTokenCookie).toHaveBeenCalled();
			expect(mockTokenService.setRefreshTokenCookie).toHaveBeenCalled();
			expect(result.accessToken).toBe("new-access-token");
		});
	});

	describe("signUpUser", () => {
		it("회원가입이 성공해야 한다", async () => {
			// Given
			const signUpDto: SignUpPayloadDto = {
				email: "new@example.com",
				password: "password123",
				name: "New User",
			} as any;
			const signUpResult = {
				accessToken: "access-token",
				refreshToken: "refresh-token",
				user: mockUser,
			};
			mockAuthFacade.signUp.mockResolvedValue(signUpResult as any);

			// When
			const result = await controller.signUpUser(signUpDto);

			// Then
			expect(mockAuthFacade.signUp).toHaveBeenCalledWith(signUpDto);
			expect(result).toEqual(signUpResult);
		});
	});

	describe("verifyToken", () => {
		it("유효한 토큰은 true를 반환해야 한다", async () => {
			// Given
			mockClsService.get.mockReturnValue("valid-token");
			mockTokenService.verifyToken.mockReturnValue(true);

			// When
			const result = await controller.verifyToken();

			// Then
			expect(mockClsService.get).toHaveBeenCalledWith(CONTEXT_KEYS.TOKEN);
			expect(mockTokenService.verifyToken).toHaveBeenCalledWith("valid-token");
			expect(result).toBe(true);
		});

		it("토큰이 없으면 UnauthorizedException을 던져야 한다", async () => {
			// Given
			mockClsService.get.mockReturnValue(null);

			// When & Then
			await expect(controller.verifyToken()).rejects.toThrow(
				UnauthorizedException,
			);
		});

		it("유효하지 않은 토큰은 false를 반환해야 한다", async () => {
			// Given
			mockClsService.get.mockReturnValue("invalid-token");
			mockTokenService.verifyToken.mockReturnValue(false);

			// When
			const result = await controller.verifyToken();

			// Then
			expect(result).toBe(false);
		});
	});

	describe("logout", () => {
		it("사용자가 있으면 토큰을 무효화해야 한다", async () => {
			// Given
			mockAuthFacade.logout.mockResolvedValue(undefined);

			// When
			const result = await controller.logout(
				mockRequest as any,
				mockResponse as any,
			);

			// Then
			expect(mockAuthFacade.logout).toHaveBeenCalledWith(
				"user-test-id",
				"test-access-token",
			);
			expect(mockTokenService.clearTokenCookies).toHaveBeenCalledWith(
				mockResponse,
			);
			expect(mockResponse.clearCookie).toHaveBeenCalledWith("tenantId");
			expect(mockResponse.clearCookie).toHaveBeenCalledWith("workspaceId");
			expect(result).toBe(true);
		});

		it("사용자가 없어도 쿠키를 삭제해야 한다", async () => {
			// Given
			const requestWithoutUser = {
				cookies: {},
				user: undefined,
			};

			// When
			const result = await controller.logout(
				requestWithoutUser as any,
				mockResponse as any,
			);

			// Then
			expect(mockAuthFacade.logout).not.toHaveBeenCalled();
			expect(mockTokenService.clearTokenCookies).toHaveBeenCalledWith(
				mockResponse,
			);
			expect(result).toBe(true);
		});
	});
});
