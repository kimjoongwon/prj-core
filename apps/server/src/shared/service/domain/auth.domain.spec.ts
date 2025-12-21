import {
	LoginPayloadDto,
	SignUpPayloadDto,
} from "@cocrepo/dto";
import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import {
	createMockPrismaService,
	createTestUserEntity,
	MockedPrismaService,
} from "../../test/test-utils";
import { UsersService } from "../resources/users.service";
import { PasswordService, TokenService } from "../utils";
import { PrismaService } from "../utils/prisma.service";
import { AuthDomain } from "./auth.domain";

describe("AuthDomain", () => {
	let domain: AuthDomain;
	let usersService: jest.Mocked<UsersService>;
	let passwordService: jest.Mocked<PasswordService>;
	let tokenService: jest.Mocked<TokenService>;
	let prisma: MockedPrismaService;

	beforeEach(async () => {
		const mockUsersService = {
			getByEmail: jest.fn(),
			getManyByQuery: jest.fn(),
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
				AuthDomain,
				{
					provide: UsersService,
					useValue: mockUsersService,
				},
				{
					provide: PasswordService,
					useValue: mockPasswordService,
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

		domain = module.get<AuthDomain>(AuthDomain);
		usersService = module.get(UsersService);
		passwordService = module.get(PasswordService);
		tokenService = module.get(TokenService);
		prisma = module.get(PrismaService);
	});

	it("should be defined", () => {
		expect(domain).toBeDefined();
	});

	describe("validateUser", () => {
		it("should return user for valid credentials", async () => {
			const email = "test@example.com";
			const password = "password123";
			const testUser = createTestUserEntity();

			usersService.getByEmail.mockResolvedValue(testUser);
			passwordService.validatePassword.mockResolvedValue(true);

			const result = await domain.validateUser(email, password);

			expect(usersService.getByEmail).toHaveBeenCalledWith(email);
			expect(passwordService.validatePassword).toHaveBeenCalledWith(
				password,
				testUser.password,
			);
			expect(result).toEqual(testUser);
		});

		it("should throw UnauthorizedException for invalid password", async () => {
			const email = "test@example.com";
			const password = "wrong-password";
			const testUser = createTestUserEntity();

			usersService.getByEmail.mockResolvedValue(testUser);
			passwordService.validatePassword.mockResolvedValue(false);

			await expect(domain.validateUser(email, password)).rejects.toThrow(
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

			usersService.getByEmail.mockResolvedValue(null as any);
			passwordService.validatePassword.mockResolvedValue(false);

			await expect(domain.validateUser(email, password)).rejects.toThrow(
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
			const newSpace = { id: "new-space-id" };
			const newUser = { id: "new-user-id" };
			const tokens = {
				accessToken: "access-token",
				refreshToken: "refresh-token",
			};
			const hashedPassword = "hashed-password";

			prisma.role.findFirst.mockResolvedValue(userRole as any);
			prisma.space.create.mockResolvedValue(newSpace as any);
			passwordService.hashPassword.mockResolvedValue(hashedPassword);
			usersService.create.mockResolvedValue(newUser as any);
			tokenService.generateTokens.mockReturnValue(tokens);

			const result = await domain.signUp(signUpData);

			expect(prisma.role.findFirst).toHaveBeenCalledWith({
				where: { name: "USER" },
			});
			expect(prisma.space.create).toHaveBeenCalledWith({
				data: {},
			});
			expect(passwordService.hashPassword).toHaveBeenCalledWith(
				signUpData.password,
			);
			expect(usersService.create).toHaveBeenCalledWith({
				data: {
					name: signUpData.name,
					email: signUpData.email,
					phone: signUpData.phone,
					password: hashedPassword,
					tenants: {
						create: {
							main: true,
							spaceId: newSpace.id,
							roleId: userRole.id,
						},
					},
					profiles: {
						create: {
							name: signUpData.name,
							nickname: signUpData.nickname || signUpData.name,
						},
					},
				},
			});
			expect(tokenService.generateTokens).toHaveBeenCalledWith({
				userId: newUser.id,
			});
			expect(result).toEqual(tokens);
		});

		it("should throw BadRequestException when USER role does not exist", async () => {
			const signUpData: SignUpPayloadDto = {
				name: "Test User",
				nickname: "testuser",
				email: "test@example.com",
				password: "password123",
				phone: "010-1234-5678",
				spaceId: "space-test-id",
			};

			prisma.role.findFirst.mockResolvedValue(null);

			await expect(domain.signUp(signUpData)).rejects.toThrow(
				BadRequestException,
			);

			expect(prisma.role.findFirst).toHaveBeenCalledWith({
				where: { name: "USER" },
			});
		});
	});

	describe("login", () => {
		it("should return tokens and user for valid credentials", async () => {
			const loginData: LoginPayloadDto = {
				email: "test@example.com",
				password: "password123",
			};

			const testUser = createTestUserEntity({ email: loginData.email });
			const tokens = {
				accessToken: "access-token",
				refreshToken: "refresh-token",
			};
			const mockQueryResult = {
				users: [testUser],
				count: 1,
			};

			usersService.getManyByQuery.mockResolvedValue(mockQueryResult);
			passwordService.validatePassword.mockResolvedValue(true);
			tokenService.generateTokens.mockReturnValue(tokens);

			const result = await domain.login(loginData);

			expect(usersService.getManyByQuery).toHaveBeenCalledWith(
				expect.any(Object),
			);
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

			const mockQueryResult = {
				users: [],
				count: 0,
			};
			usersService.getManyByQuery.mockResolvedValue(mockQueryResult);

			await expect(domain.login(loginData)).rejects.toThrow(
				UnauthorizedException,
			);
			expect(usersService.getManyByQuery).toHaveBeenCalledWith(
				expect.any(Object),
			);
		});

		it("should throw BadRequestException for invalid password", async () => {
			const loginData: LoginPayloadDto = {
				email: "test@example.com",
				password: "wrong-password",
			};

			const testUser = createTestUserEntity({ email: loginData.email });
			const mockQueryResult = {
				users: [testUser],
				count: 1,
			};

			usersService.getManyByQuery.mockResolvedValue(mockQueryResult);
			passwordService.validatePassword.mockResolvedValue(false);

			await expect(domain.login(loginData)).rejects.toThrow(
				BadRequestException,
			);
			expect(passwordService.validatePassword).toHaveBeenCalledWith(
				loginData.password,
				testUser.password,
			);
		});
	});
});
