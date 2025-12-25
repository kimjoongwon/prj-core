import {
	parseJwtExpiresInToMs,
	createCookieOptions,
	getAccessTokenCookieOptions,
	getRefreshTokenCookieOptions,
	getDefaultCookieOptions,
} from "../src/utils/cookie.util";

describe("CookieUtil", () => {
	const originalEnv = process.env;

	beforeEach(() => {
		process.env = { ...originalEnv };
	});

	afterEach(() => {
		process.env = originalEnv;
	});

	describe("parseJwtExpiresInToMs", () => {
		it("숫자를 밀리초로 변환해야 한다 (초 단위)", () => {
			// Given
			const expiresIn = 3600;

			// When
			const result = parseJwtExpiresInToMs(expiresIn);

			// Then
			expect(result).toBe(3600 * 1000);
		});

		it("초 단위 문자열을 파싱해야 한다", () => {
			// Given
			const expiresIn = "30s";

			// When
			const result = parseJwtExpiresInToMs(expiresIn);

			// Then
			expect(result).toBe(30 * 1000);
		});

		it("분 단위 문자열을 파싱해야 한다", () => {
			// Given
			const expiresIn = "15m";

			// When
			const result = parseJwtExpiresInToMs(expiresIn);

			// Then
			expect(result).toBe(15 * 60 * 1000);
		});

		it("시간 단위 문자열을 파싱해야 한다", () => {
			// Given
			const expiresIn = "1h";

			// When
			const result = parseJwtExpiresInToMs(expiresIn);

			// Then
			expect(result).toBe(60 * 60 * 1000);
		});

		it("일 단위 문자열을 파싱해야 한다", () => {
			// Given
			const expiresIn = "7d";

			// When
			const result = parseJwtExpiresInToMs(expiresIn);

			// Then
			expect(result).toBe(7 * 24 * 60 * 60 * 1000);
		});

		it("잘못된 형식은 에러를 던져야 한다", () => {
			// Given
			const expiresIn = "invalid";

			// When & Then
			expect(() => parseJwtExpiresInToMs(expiresIn)).toThrow(
				"Invalid expiresIn format: invalid",
			);
		});

		it("지원하지 않는 단위는 에러를 던져야 한다", () => {
			// Given
			const expiresIn = "10w";

			// When & Then
			expect(() => parseJwtExpiresInToMs(expiresIn)).toThrow();
		});
	});

	describe("createCookieOptions", () => {
		it("개발 환경에서 쿠키 옵션을 생성해야 한다", () => {
			// Given
			const maxAge = 3600000;
			const isProduction = false;

			// When
			const result = createCookieOptions(maxAge, isProduction);

			// Then
			expect(result).toEqual({
				httpOnly: true,
				secure: false,
				sameSite: "strict",
				maxAge,
				path: "/",
			});
		});

		it("프로덕션 환경에서 secure 플래그를 설정해야 한다", () => {
			// Given
			const maxAge = 3600000;
			const isProduction = true;

			// When
			const result = createCookieOptions(maxAge, isProduction);

			// Then
			expect(result).toEqual({
				httpOnly: true,
				secure: true,
				sameSite: "strict",
				maxAge,
				path: "/",
			});
		});

		it("NODE_ENV가 production이면 secure를 true로 설정해야 한다", () => {
			// Given
			process.env.NODE_ENV = "production";
			const maxAge = 3600000;

			// When
			const result = createCookieOptions(maxAge);

			// Then
			expect(result.secure).toBe(true);
		});

		it("NODE_ENV가 development면 secure를 false로 설정해야 한다", () => {
			// Given
			process.env.NODE_ENV = "development";
			const maxAge = 3600000;

			// When
			const result = createCookieOptions(maxAge);

			// Then
			expect(result.secure).toBe(false);
		});
	});

	describe("getAccessTokenCookieOptions", () => {
		it("액세스 토큰 쿠키 옵션을 생성해야 한다", () => {
			// Given
			process.env.NODE_ENV = "development";
			const expiresIn = "1h";

			// When
			const result = getAccessTokenCookieOptions(expiresIn);

			// Then
			expect(result).toEqual({
				httpOnly: true,
				secure: false,
				sameSite: "strict",
				maxAge: 60 * 60 * 1000,
				path: "/",
			});
		});

		it("숫자 형태의 만료 시간을 처리해야 한다", () => {
			// Given
			process.env.NODE_ENV = "development";
			const expiresIn = 3600;

			// When
			const result = getAccessTokenCookieOptions(expiresIn);

			// Then
			expect(result.maxAge).toBe(3600 * 1000);
		});
	});

	describe("getRefreshTokenCookieOptions", () => {
		it("리프레시 토큰 쿠키 옵션을 생성해야 한다", () => {
			// Given
			process.env.NODE_ENV = "development";
			const expiresIn = "7d";

			// When
			const result = getRefreshTokenCookieOptions(expiresIn);

			// Then
			expect(result).toEqual({
				httpOnly: true,
				secure: false,
				sameSite: "strict",
				maxAge: 7 * 24 * 60 * 60 * 1000,
				path: "/",
			});
		});
	});

	describe("getDefaultCookieOptions", () => {
		it("기본 쿠키 옵션을 반환해야 한다 (개발 환경)", () => {
			// Given
			process.env.NODE_ENV = "development";

			// When
			const result = getDefaultCookieOptions();

			// Then
			expect(result).toEqual({
				httpOnly: false,
				secure: false,
				sameSite: "strict",
				path: "/",
			});
		});

		it("프로덕션 환경에서는 secure를 true로 설정해야 한다", () => {
			// Given
			process.env.NODE_ENV = "production";

			// When
			const result = getDefaultCookieOptions();

			// Then
			expect(result.secure).toBe(true);
		});

		it("httpOnly가 false여야 한다 (클라이언트 접근 가능)", () => {
			// When
			const result = getDefaultCookieOptions();

			// Then
			expect(result.httpOnly).toBe(false);
		});
	});
});
