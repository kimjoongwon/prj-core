import { LoginPayloadDto, SignUpPayloadDto } from "@cocrepo/dto";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import {
	createMockJwtService,
	createTestUserEntity,
} from "../../test/test-utils";
import { AuthDomain } from "../domain/auth.domain";
import { UsersService } from "../resources/users.service";
import { TokenService } from "../utils";
import { AuthFacade } from "./auth.facade";

describe("AuthFacade", () => {
	let service: AuthFacade;
	let authDomain: jest.Mocked<AuthDomain>;
	let usersService: jest.Mocked<UsersService>;
	let jwtService: jest.Mocked<JwtService>;
	let tokenService: jest.Mocked<TokenService>;

	beforeEach(async () => {
		const mockAuthDomain = {
			validateUser: jest.fn(),
			signUp: jest.fn(),
			login: jest.fn(),
		};

		const mockUsersService = {
			getByIdWithTenants: jest.fn(),
		};

		const mockTokenService = {
			generateTokens: jest.fn(),
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthFacade,
				{
					provide: AuthDomain,
					useValue: mockAuthDomain,
				},
				{
					provide: UsersService,
					useValue: mockUsersService,
				},
				{
					provide: JwtService,
					useValue: createMockJwtService(),
				},
				{
					provide: TokenService,
					useValue: mockTokenService,
				},
			],
		}).compile();

		service = module.get<AuthFacade>(AuthFacade);
		authDomain = module.get(AuthDomain);
		usersService = module.get(UsersService);
		jwtService = module.get(JwtService);
		tokenService = module.get(TokenService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("getCurrentUser", () => {
		it("should return current user for valid access token", async () => {
			const userId = "user-test-id";
			const accessToken = "valid-access-token";
			const testUser = createTestUserEntity();

			jwtService.verify = jest.fn().mockReturnValue({ userId });
			usersService.getByIdWithTenants.mockResolvedValue(testUser);

			const result = await service.getCurrentUser(accessToken);

			expect(jwtService.verify).toHaveBeenCalledWith(accessToken);
			expect(usersService.getByIdWithTenants).toHaveBeenCalledWith(userId);
			expect(result).toEqual(testUser);
		});

		it("should throw error for invalid access token", async () => {
			const accessToken = "invalid-access-token";

			jwtService.verify = jest.fn().mockImplementation(() => {
				throw new Error("Invalid token");
			});

			await expect(service.getCurrentUser(accessToken)).rejects.toThrow(
				"Invalid token",
			);
		});
	});

	describe("getNewToken", () => {
		it("should generate new tokens for valid refresh token", async () => {
			const userId = "user-test-id";
			const refreshToken = "valid-refresh-token";
			const newTokens = {
				accessToken: "new-access-token",
				refreshToken: "new-refresh-token",
			};

			jwtService.verify = jest.fn().mockReturnValue({ userId });
			tokenService.generateTokens.mockReturnValue(newTokens);

			const result = await service.getNewToken(refreshToken);

			expect(jwtService.verify).toHaveBeenCalledWith(refreshToken);
			expect(tokenService.generateTokens).toHaveBeenCalledWith({ userId });
			expect(result).toEqual({
				newAccessToken: newTokens.accessToken,
				newRefreshToken: newTokens.refreshToken,
			});
		});

		it("should throw error for invalid refresh token", async () => {
			const refreshToken = "invalid-refresh-token";

			jwtService.verify = jest.fn().mockImplementation(() => {
				throw new Error("Invalid token");
			});

			await expect(service.getNewToken(refreshToken)).rejects.toThrow(
				"Invalid token",
			);
		});
	});

	describe("validateUser", () => {
		it("should delegate to authDomain.validateUser", async () => {
			const email = "test@example.com";
			const password = "password123";
			const testUser = createTestUserEntity();

			authDomain.validateUser.mockResolvedValue(testUser);

			const result = await service.validateUser(email, password);

			expect(authDomain.validateUser).toHaveBeenCalledWith(email, password);
			expect(result).toEqual(testUser);
		});
	});

	describe("signUp", () => {
		it("should delegate to authDomain.signUp", async () => {
			const signUpData: SignUpPayloadDto = {
				name: "Test User",
				nickname: "testuser",
				email: "test@example.com",
				password: "password123",
				phone: "010-1234-5678",
				spaceId: "space-test-id",
			};

			const tokens = {
				accessToken: "access-token",
				refreshToken: "refresh-token",
			};

			authDomain.signUp.mockResolvedValue(tokens);

			const result = await service.signUp(signUpData);

			expect(authDomain.signUp).toHaveBeenCalledWith(signUpData);
			expect(result).toEqual(tokens);
		});
	});

	describe("login", () => {
		it("should delegate to authDomain.login", async () => {
			const loginData: LoginPayloadDto = {
				email: "test@example.com",
				password: "password123",
			};

			const testUser = createTestUserEntity({ email: loginData.email });
			const tokens = {
				accessToken: "access-token",
				refreshToken: "refresh-token",
				user: testUser,
			};

			authDomain.login.mockResolvedValue(tokens);

			const result = await service.login(loginData);

			expect(authDomain.login).toHaveBeenCalledWith(loginData);
			expect(result).toEqual(tokens);
		});
	});
});
