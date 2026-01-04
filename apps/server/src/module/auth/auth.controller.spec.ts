import type { LoginPayloadDto, SignUpPayloadDto } from "@cocrepo/dto";
import { AuthFacade } from "@cocrepo/facade";
import { UnauthorizedException } from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";

describe("AuthController", () => {
	let controller: AuthController;
	let mockAuthFacade: jest.Mocked<AuthFacade>;

	const mockTokenExpiryInfo = {
		accessTokenExpiresAt: Date.now() + 60 * 60 * 1000, // 1시간 후
		refreshTokenExpiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7일 후
	};

	const mockUser = {
		id: "user-test-id",
		email: "test@example.com",
		name: "Test User",
		selectedSpaceId: null,
		tenants: [
			{
				id: "tenant-test-id",
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
			loginWithCookie: jest.fn(),
			signUp: jest.fn(),
			getNewToken: jest.fn(),
			getNewTokenWithCookie: jest.fn(),
			refreshTokenWithCookie: jest.fn(),
			getCurrentUser: jest.fn(),
			logout: jest.fn(),
			logoutWithCookie: jest.fn(),
			verifyToken: jest.fn(),
			setTokenCookies: jest.fn(),
			clearTokenCookies: jest.fn(),
		} as unknown as jest.Mocked<AuthFacade>;

		const module: TestingModule = await Test.createTestingModule({
			controllers: [AuthController],
			providers: [{ provide: AuthFacade, useValue: mockAuthFacade }],
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
			mockAuthFacade.loginWithCookie.mockResolvedValue({
				accessToken: "access-token",
				refreshToken: "refresh-token",
				accessTokenExpiresAt: mockTokenExpiryInfo.accessTokenExpiresAt,
				refreshTokenExpiresAt: mockTokenExpiryInfo.refreshTokenExpiresAt,
				user: mockUser as never,
			});

			// When
			const result = await controller.login(
				loginDto,
				mockResponse as unknown as never,
			);

			// Then
			expect(mockAuthFacade.loginWithCookie).toHaveBeenCalledWith(
				loginDto,
				mockResponse,
			);
			expect(result.accessToken).toBe("access-token");
			expect(result.refreshToken).toBe("refresh-token");
			expect(result.accessTokenExpiresAt).toBe(
				mockTokenExpiryInfo.accessTokenExpiresAt,
			);
			expect(result.refreshTokenExpiresAt).toBe(
				mockTokenExpiryInfo.refreshTokenExpiresAt,
			);
		});
	});

	describe("refreshToken", () => {
		it("리프레시 토큰이 있으면 새 토큰을 발급해야 한다", async () => {
			// Given
			mockAuthFacade.refreshTokenWithCookie.mockResolvedValue({
				accessToken: "new-access-token",
				refreshToken: "new-refresh-token",
				accessTokenExpiresAt: mockTokenExpiryInfo.accessTokenExpiresAt,
				refreshTokenExpiresAt: mockTokenExpiryInfo.refreshTokenExpiresAt,
				user: mockUser as never,
			});

			// When
			const result = await controller.refreshToken(
				mockRequest as unknown as never,
				mockResponse as unknown as never,
			);

			// Then
			expect(mockAuthFacade.refreshTokenWithCookie).toHaveBeenCalledWith(
				"test-refresh-token",
				mockResponse,
			);
			expect(result.accessToken).toBe("new-access-token");
			expect(result.accessTokenExpiresAt).toBe(
				mockTokenExpiryInfo.accessTokenExpiresAt,
			);
			expect(result.refreshTokenExpiresAt).toBe(
				mockTokenExpiryInfo.refreshTokenExpiresAt,
			);
		});

		it("리프레시 토큰이 없으면 UnauthorizedException을 던져야 한다", async () => {
			// Given
			const requestWithoutToken = { cookies: {} };
			mockAuthFacade.refreshTokenWithCookie.mockRejectedValue(
				new UnauthorizedException("리프레시 토큰이 존재하지 않습니다"),
			);

			// When & Then
			await expect(
				controller.refreshToken(
					requestWithoutToken as unknown as never,
					mockResponse as unknown as never,
				),
			).rejects.toThrow(UnauthorizedException);
		});

		it("사용자를 찾을 수 없으면 UnauthorizedException을 던져야 한다", async () => {
			// Given
			mockAuthFacade.refreshTokenWithCookie.mockRejectedValue(
				new UnauthorizedException("사용자를 찾을 수 없습니다"),
			);

			// When & Then
			await expect(
				controller.refreshToken(
					mockRequest as unknown as never,
					mockResponse as unknown as never,
				),
			).rejects.toThrow(UnauthorizedException);
		});
	});

	describe("getNewToken", () => {
		it("인증된 사용자의 토큰을 갱신해야 한다", async () => {
			// Given
			mockAuthFacade.getNewTokenWithCookie.mockResolvedValue({
				accessToken: "new-access-token",
				refreshToken: "new-refresh-token",
				accessTokenExpiresAt: mockTokenExpiryInfo.accessTokenExpiresAt,
				refreshTokenExpiresAt: mockTokenExpiryInfo.refreshTokenExpiresAt,
				user: mockUser as never,
			});

			// When
			const result = await controller.getNewToken(
				mockRequest as unknown as never,
				mockResponse as unknown as never,
			);

			// Then
			expect(mockAuthFacade.getNewTokenWithCookie).toHaveBeenCalledWith(
				"test-refresh-token",
				mockUser,
				mockResponse,
			);
			expect(result.accessToken).toBe("new-access-token");
			expect(result.accessTokenExpiresAt).toBe(
				mockTokenExpiryInfo.accessTokenExpiresAt,
			);
		});
	});

	describe("signUpUser", () => {
		it("회원가입이 성공해야 한다", async () => {
			// Given
			const signUpDto: SignUpPayloadDto = {
				email: "new@example.com",
				password: "password123",
				name: "New User",
			} as never;
			const signUpResult = {
				accessToken: "access-token",
				refreshToken: "refresh-token",
				user: mockUser,
			};
			mockAuthFacade.signUp.mockResolvedValue(signUpResult as never);

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
			mockAuthFacade.verifyToken.mockReturnValue(true);

			// When
			const result = await controller.verifyToken();

			// Then
			expect(mockAuthFacade.verifyToken).toHaveBeenCalled();
			expect(result).toBe(true);
		});

		it("토큰이 없으면 UnauthorizedException을 던져야 한다", async () => {
			// Given
			mockAuthFacade.verifyToken.mockImplementation(() => {
				throw new UnauthorizedException("토큰이 존재하지 않습니다");
			});

			// When & Then
			await expect(controller.verifyToken()).rejects.toThrow(
				UnauthorizedException,
			);
		});

		it("유효하지 않은 토큰은 false를 반환해야 한다", async () => {
			// Given
			mockAuthFacade.verifyToken.mockReturnValue(false);

			// When
			const result = await controller.verifyToken();

			// Then
			expect(result).toBe(false);
		});
	});

	describe("logout", () => {
		it("사용자가 있으면 토큰을 무효화해야 한다", async () => {
			// Given
			mockAuthFacade.logoutWithCookie.mockResolvedValue(true);

			// When
			const result = await controller.logout(
				mockRequest as unknown as never,
				mockResponse as unknown as never,
			);

			// Then
			expect(mockAuthFacade.logoutWithCookie).toHaveBeenCalledWith(
				"user-test-id",
				"test-access-token",
				mockResponse,
			);
			expect(result).toBe(true);
		});

		it("사용자가 없어도 쿠키를 삭제해야 한다", async () => {
			// Given
			const requestWithoutUser = {
				cookies: {},
				user: undefined,
			};
			mockAuthFacade.logoutWithCookie.mockResolvedValue(true);

			// When
			const result = await controller.logout(
				requestWithoutUser as unknown as never,
				mockResponse as unknown as never,
			);

			// Then
			expect(mockAuthFacade.logoutWithCookie).toHaveBeenCalledWith(
				undefined,
				undefined,
				mockResponse,
			);
			expect(result).toBe(true);
		});
	});
});
