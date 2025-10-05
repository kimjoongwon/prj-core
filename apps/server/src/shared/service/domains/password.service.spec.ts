import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import * as bcrypt from "bcrypt";
import { createMockConfigService } from "../../test/test-utils";
import { PasswordService } from "./password.service";

// Mock bcrypt module
jest.mock("bcrypt");

const mockCompare = bcrypt.compare as jest.Mock;
const mockHash = bcrypt.hash as jest.Mock;
const mockHashSync = bcrypt.hashSync as jest.Mock;

describe("PasswordService", () => {
	let service: PasswordService;
	let configService: jest.Mocked<ConfigService>;

	beforeEach(async () => {
		// Clear mocks before each test
		jest.clearAllMocks();

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				PasswordService,
				{
					provide: ConfigService,
					useValue: createMockConfigService(),
				},
			],
		}).compile();

		service = module.get<PasswordService>(PasswordService);
		configService = module.get(ConfigService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("validatePassword", () => {
		it("should return true for valid password", async () => {
			const password = "password123";
			const hashedPassword = "$2b$10$hashedPassword";

			mockCompare.mockResolvedValue(true);

			const result = await service.validatePassword(password, hashedPassword);

			expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
			expect(result).toBe(true);
		});

		it("should return false for invalid password", async () => {
			const password = "wrongPassword";
			const hashedPassword = "$2b$10$hashedPassword";

			mockCompare.mockResolvedValue(false);

			const result = await service.validatePassword(password, hashedPassword);

			expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
			expect(result).toBe(false);
		});

		it("should handle bcrypt errors", async () => {
			const password = "password123";
			const hashedPassword = "invalid-hash";

			mockCompare.mockRejectedValue(new Error("Invalid hash"));

			await expect(
				service.validatePassword(password, hashedPassword),
			).rejects.toThrow("Invalid hash");
		});
	});

	describe("hashPassword", () => {
		it("should hash password with config salt rounds", async () => {
			const password = "password123";
			const expectedHash = "$2b$12$hashedPassword";
			const authConfig = { bcryptSaltOrRound: 12 };

			configService.get = jest.fn().mockReturnValue(authConfig);
			mockHash.mockResolvedValue(expectedHash);

			const result = await service.hashPassword(password);

			expect(configService.get).toHaveBeenCalledWith("auth");
			expect(bcrypt.hash).toHaveBeenCalledWith(password, 12);
			expect(result).toBe(expectedHash);
		});

		it("should use default salt rounds when config is not available", async () => {
			const password = "password123";
			const expectedHash = "$2b$10$hashedPassword";

			configService.get = jest.fn().mockReturnValue(null);
			mockHash.mockResolvedValue(expectedHash);

			const result = await service.hashPassword(password);

			expect(configService.get).toHaveBeenCalledWith("auth");
			expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
			expect(result).toBe(expectedHash);
		});

		it("should use default salt rounds when bcryptSaltOrRound is undefined", async () => {
			const password = "password123";
			const expectedHash = "$2b$10$hashedPassword";
			const authConfig = {}; // bcryptSaltOrRound is undefined

			configService.get = jest.fn().mockReturnValue(authConfig);
			mockHash.mockResolvedValue(expectedHash);

			const result = await service.hashPassword(password);

			expect(configService.get).toHaveBeenCalledWith("auth");
			expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
			expect(result).toBe(expectedHash);
		});

		it("should handle hashing errors", async () => {
			const password = "password123";

			configService.get = jest.fn().mockReturnValue({ bcryptSaltOrRound: 10 });
			mockHash.mockRejectedValue(new Error("Hashing failed"));

			await expect(service.hashPassword(password)).rejects.toThrow(
				"Hashing failed",
			);
		});
	});

	describe("generateHash (static method)", () => {
		it("should generate hash with default salt rounds", () => {
			const password = "password123";
			const expectedHash = "$2b$10$hashedPassword";

			mockHashSync.mockReturnValue(expectedHash);

			const result = PasswordService.generateHash(password);

			expect(bcrypt.hashSync).toHaveBeenCalledWith(password, 10);
			expect(result).toBe(expectedHash);
		});

		it("should handle empty password", () => {
			const password = "";
			const expectedHash = "$2b$10$emptyHash";

			mockHashSync.mockReturnValue(expectedHash);

			const result = PasswordService.generateHash(password);

			expect(bcrypt.hashSync).toHaveBeenCalledWith(password, 10);
			expect(result).toBe(expectedHash);
		});
	});

	describe("validateHash (static method)", () => {
		it("should return true for valid password and hash", async () => {
			const password = "password123";
			const hash = "$2b$10$hashedPassword";

			mockCompare.mockResolvedValue(true);

			const result = await PasswordService.validateHash(password, hash);

			expect(bcrypt.compare).toHaveBeenCalledWith(password, hash);
			expect(result).toBe(true);
		});

		it("should return false for invalid password", async () => {
			const password = "wrongPassword";
			const hash = "$2b$10$hashedPassword";

			mockCompare.mockResolvedValue(false);

			const result = await PasswordService.validateHash(password, hash);

			expect(bcrypt.compare).toHaveBeenCalledWith(password, hash);
			expect(result).toBe(false);
		});

		it("should return false when password is undefined", async () => {
			const password = undefined;
			const hash = "$2b$10$hashedPassword";

			const result = await PasswordService.validateHash(password, hash);

			expect(bcrypt.compare).not.toHaveBeenCalled();
			expect(result).toBe(false);
		});

		it("should return false when hash is undefined", async () => {
			const password = "password123";
			const hash = undefined;

			const result = await PasswordService.validateHash(password, hash);

			expect(bcrypt.compare).not.toHaveBeenCalled();
			expect(result).toBe(false);
		});

		it("should return false when hash is null", async () => {
			const password = "password123";
			const hash = null;

			const result = await PasswordService.validateHash(password, hash);

			expect(bcrypt.compare).not.toHaveBeenCalled();
			expect(result).toBe(false);
		});

		it("should return false when password is empty string", async () => {
			const password = "";
			const hash = "$2b$10$hashedPassword";

			const result = await PasswordService.validateHash(password, hash);

			expect(bcrypt.compare).not.toHaveBeenCalled();
			expect(result).toBe(false);
		});

		it("should return false when hash is empty string", async () => {
			const password = "password123";
			const hash = "";

			const result = await PasswordService.validateHash(password, hash);

			expect(bcrypt.compare).not.toHaveBeenCalled();
			expect(result).toBe(false);
		});

		it("should handle bcrypt errors in static method", async () => {
			const password = "password123";
			const hash = "invalid-hash";

			mockCompare.mockRejectedValue(new Error("Invalid hash format"));

			await expect(
				PasswordService.validateHash(password, hash),
			).rejects.toThrow("Invalid hash format");
		});
	});
});
