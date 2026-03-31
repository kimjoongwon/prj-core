import { Token } from "@cocrepo/constant";
import { BadRequestException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Test, type TestingModule } from "@nestjs/testing";
import type { Request, Response } from "express";
import { ClsService } from "nestjs-cls";
import { TokenService } from "../src/token.service";
import { TokenStorageService } from "../src/token-storage.service";

describe("TokenService", () => {
	let service: TokenService;
	let mockConfigService: jest.Mocked<ConfigService>;
	let mockTokenStorageService: jest.Mocked<TokenStorageService>;
	let mockClsService: jest.Mocked<ClsService>;

	beforeEach(async () => {
		mockConfigService = {
			get: jest.fn().mockReturnValue({
				expires: "1h",
				refresh: "7d",
			}),
		} as unknown as jest.Mocked<ConfigService>;

		mockTokenStorageService = {
			isBlacklisted: jest.fn(),
		} as unknown as jest.Mocked<TokenStorageService>;

		mockClsService = {
			get: jest.fn(),
		} as unknown as jest.Mocked<ClsService>;

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				TokenService,
				{ provide: ConfigService, useValue: mockConfigService },
				{ provide: TokenStorageService, useValue: mockTokenStorageService },
				{ provide: ClsService, useValue: mockClsService },
			],
		}).compile();

		service = module.get<TokenService>(TokenService);
	});

	it("서비스가 정의되어야 한다", () => {
		expect(service).toBeDefined();
	});

	it("요청에서 토큰을 조회해야 한다", () => {
		const req = {
			cookies: { [Token.ACCESS]: "access-token" },
		} as unknown as Request;

		expect(service.getTokenFromRequest(req)).toBe("access-token");
	});

	it("토큰이 없으면 예외를 던져야 한다", () => {
		const req = { cookies: {} } as unknown as Request;
		expect(() => service.getTokenFromRequest(req)).toThrow(BadRequestException);
	});

	it("httpOnly 쿠키를 설정해야 한다", () => {
		const res = { cookie: jest.fn() } as unknown as Response;
		service.setTokenToHTTPOnlyCookie(res, Token.ACCESS, "access-token");
		expect((res as unknown as { cookie: jest.Mock }).cookie).toHaveBeenCalled();
	});

	it("토큰 쿠키를 삭제해야 한다", () => {
		const res = { clearCookie: jest.fn() } as unknown as Response;
		service.clearTokenCookies(res);
		expect((res as unknown as { clearCookie: jest.Mock }).clearCookie).toHaveBeenCalledTimes(2);
	});

	it("선택된 Space 쿠키를 설정해야 한다", () => {
		const res = { cookie: jest.fn() } as unknown as Response;
		service.setSelectedSpaceCookie(res, "space-123");
		expect((res as unknown as { cookie: jest.Mock }).cookie).toHaveBeenCalledWith(
			Token.SELECTED_SPACE_ID,
			"space-123",
			expect.objectContaining({ httpOnly: true }),
		);
	});

	it("선택된 Space 쿠키를 삭제해야 한다", () => {
		const res = { clearCookie: jest.fn() } as unknown as Response;
		service.clearSelectedSpaceCookie(res);
		expect((res as unknown as { clearCookie: jest.Mock }).clearCookie).toHaveBeenCalledWith(
			Token.SELECTED_SPACE_ID,
			expect.objectContaining({ httpOnly: true }),
		);
	});

	it("블랙리스트 여부를 위임 조회해야 한다", async () => {
		mockTokenStorageService.isBlacklisted.mockResolvedValue(true);
		const result = await service.isTokenBlacklisted("access-token");
		expect(result).toBe(true);
		expect(mockTokenStorageService.isBlacklisted).toHaveBeenCalledWith(
			"access-token",
		);
	});
});
