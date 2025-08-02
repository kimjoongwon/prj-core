import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { LoginPayloadDto, SignUpPayloadDto } from "@shared/schema";
import { PrismaService } from "nestjs-prisma";
import {
	createMockJwtService,
	createMockPrismaService,
	createTestUserDto,
	MockedPrismaService,
} from "../test/test-utils";
import { AuthService } from "./auth.service";
import { PasswordService } from "./password.service";
import { TokenService } from "./token.service";
import { UsersService } from "./users.service";

describe("AuthService", () => {
	let service: AuthService;
	let usersService: jest.Mocked<UsersService>;
	let passwordService: jest.Mocked<PasswordService>;
	let jwtService: jest.Mocked<JwtService>;
	let tokenService: jest.Mocked<TokenService>;
	let prisma: MockedPrismaService;

	beforeEach(async () => {
		const mockUsersService = {
			getUnique: jest.fn(),
			create: jest.fn(),
		};

		const mockPasswordService = {
			validatePassword: jest.fn(),
			hashPassword: jest.fn(),
		};

		const mockTokenService = {
			generateTokens: jest.fn(),
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				{
					provide: UsersService,
					useValue: mockUsersService,
				},
				{
					provide: PasswordService,
					useValue: mockPasswordService,
				},
				{
					provide: JwtService,
					useValue: createMockJwtService(),
				},
				{
					provide: TokenService,
					useValue: mockTokenService,
				},
				{
					provide: PrismaService,
					useValue: createMockPrismaService(),
				},
			],
		}).compile();

		service = module.get<AuthService>(AuthService);
		usersService = module.get(UsersService);
		passwordService = module.get(PasswordService);
		jwtService = module.get(JwtService);
		tokenService = module.get(TokenService);
		prisma = module.get(PrismaService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("getCurrentUser", () => {
		it("should return current user for valid access token", async () => {
			const userId = "user-test-id";
			const accessToken = "valid-access-token";
			const testUser = createTestUserDto();

			jwtService.verify = jest.fn().mockReturnValue({ userId });
			usersService.getUnique.mockResolvedValue(testUser);

			const result = await service.getCurrentUser(accessToken);

			expect(jwtService.verify).toHaveBeenCalledWith(accessToken);
			expect(usersService.getUnique).toHaveBeenCalledWith({
				where: { id: userId },
			});
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
		it("should return user for valid credentials", async () => {
			const email = "test@example.com";
			const password = "password123";
			const testUser = createTestUserDto();

			usersService.getUnique.mockResolvedValue(testUser);
			passwordService.validatePassword.mockResolvedValue(true);

			const result = await service.validateUser(email, password);

			expect(usersService.getUnique).toHaveBeenCalledWith({
				where: { name: email },
			});
			expect(passwordService.validatePassword).toHaveBeenCalledWith(
				password,
				testUser.password,
			);
			expect(result).toEqual(testUser);
		});

		it("should throw UnauthorizedException for invalid password", async () => {
			const email = "test@example.com";
			const password = "wrong-password";
			const testUser = createTestUserDto();

			usersService.getUnique.mockResolvedValue(testUser);
			passwordService.validatePassword.mockResolvedValue(false);

			await expect(service.validateUser(email, password)).rejects.toThrow(
				UnauthorizedException,
			);
			expect(passwordService.validatePassword).toHaveBeenCalledWith(
				password,
				testUser.password,
			);
		});

		it("should throw UnauthorizedException for non-existent user", async () => {
			const email = "nonexistent@example.com";
			const password = "password123";

			usersService.getUnique.mockResolvedValue(null as any);
			passwordService.validatePassword.mockResolvedValue(false);

			await expect(service.validateUser(email, password)).rejects.toThrow(
				UnauthorizedException,
			);
		});
	});

	describe("signUp", () => {
		it("should create new user with USER role", async () => {
			const signUpData: SignUpPayloadDto = {
				name: "Test User",
				nickname: "testuser",
				email: "test@example.com",
				password: "password123",
				phone: "010-1234-5678",
				spaceId: "space-test-id",
			};

			const userRole = { id: "role-id", name: "USER" };
			const newUser = { id: "new-user-id" };
			const tokens = {
				accessToken: "access-token",
				refreshToken: "refresh-token",
			};

			prisma.role.findFirst.mockResolvedValue(userRole as any);
			usersService.create.mockResolvedValue(newUser as any);
			tokenService.generateTokens.mockReturnValue(tokens);

			const result = await service.signUp(signUpData);

			expect(prisma.role.findFirst).toHaveBeenCalledWith({
				where: { name: "USER" },
			});
			expect(usersService.create).toHaveBeenCalledWith({
				data: {
					name: signUpData.name,
					phone: signUpData.phone,
					password: signUpData.password,
					tenants: {
						create: {
							main: true,
							spaceId: signUpData.spaceId,
							roleId: userRole.id,
						},
					},
					profiles: {
						create: {
							name: signUpData.name,
							nickname: signUpData.nickname,
						},
					},
				},
			});
			expect(tokenService.generateTokens).toHaveBeenCalledWith({
				userId: newUser.id,
			});
			expect(result).toEqual(tokens);
		});

		it("should create USER role if it does not exist", async () => {
			const signUpData: SignUpPayloadDto = {
				name: "Test User",
				nickname: "testuser",
				email: "test@example.com",
				password: "password123",
				phone: "010-1234-5678",
				spaceId: "space-test-id",
			};

			const newRole = { id: "new-role-id", name: "USER" };
			const newUser = { id: "new-user-id" };
			const tokens = {
				accessToken: "access-token",
				refreshToken: "refresh-token",
			};

			prisma.role.findFirst.mockResolvedValue(null);
			prisma.role.create.mockResolvedValue(newRole as any);
			usersService.create.mockResolvedValue(newUser as any);
			tokenService.generateTokens.mockReturnValue(tokens);

			const result = await service.signUp(signUpData);

			expect(prisma.role.findFirst).toHaveBeenCalledWith({
				where: { name: "USER" },
			});
			expect(prisma.role.create).toHaveBeenCalledWith({
				data: { name: "USER" },
			});
			expect(usersService.create).toHaveBeenCalledWith({
				data: {
					name: signUpData.name,
					phone: signUpData.phone,
					password: signUpData.password,
					tenants: {
						create: {
							main: true,
							spaceId: signUpData.spaceId,
							roleId: newRole.id,
						},
					},
					profiles: {
						create: {
							name: signUpData.name,
							nickname: signUpData.nickname,
						},
					},
				},
			});
			expect(result).toEqual(tokens);
		});
	});

	describe("login", () => {
		it("should return tokens and user for valid credentials", async () => {
			const loginData: LoginPayloadDto = {
				email: "test@example.com",
				password: "password123",
			};

			const testUser = createTestUserDto();
			const tokens = {
				accessToken: "access-token",
				refreshToken: "refresh-token",
			};

			usersService.getUnique.mockResolvedValue(testUser);
			passwordService.validatePassword.mockResolvedValue(true);
			tokenService.generateTokens.mockReturnValue(tokens);

			const result = await service.login(loginData);

			expect(usersService.getUnique).toHaveBeenCalledWith({
				where: { name: loginData.email },
				include: {
					profiles: true,
					tenants: {
						include: {
							space: {
								include: {
									ground: true,
								},
							},
						},
					},
				},
			});
			expect(passwordService.validatePassword).toHaveBeenCalledWith(
				loginData.password,
				testUser.password,
			);
			expect(tokenService.generateTokens).toHaveBeenCalledWith({
				userId: testUser.id,
			});
			expect(result).toEqual({
				accessToken: tokens.accessToken,
				refreshToken: tokens.refreshToken,
				user: testUser,
			});
		});

		it("should throw UnauthorizedException for non-existent user", async () => {
			const loginData: LoginPayloadDto = {
				email: "nonexistent@example.com",
				password: "password123",
			};

			usersService.getUnique.mockResolvedValue(null as any);

			await expect(service.login(loginData)).rejects.toThrow(
				UnauthorizedException,
			);
			expect(usersService.getUnique).toHaveBeenCalledWith({
				where: { name: loginData.email },
				include: {
					profiles: true,
					tenants: {
						include: {
							space: {
								include: {
									ground: true,
								},
							},
						},
					},
				},
			});
		});

		it("should throw BadRequestException for invalid password", async () => {
			const loginData: LoginPayloadDto = {
				email: "test@example.com",
				password: "wrong-password",
			};

			const testUser = createTestUserDto();

			usersService.getUnique.mockResolvedValue(testUser);
			passwordService.validatePassword.mockResolvedValue(false);

			await expect(service.login(loginData)).rejects.toThrow(
				BadRequestException,
			);
			expect(passwordService.validatePassword).toHaveBeenCalledWith(
				loginData.password,
				testUser.password,
			);
		});
	});
});
