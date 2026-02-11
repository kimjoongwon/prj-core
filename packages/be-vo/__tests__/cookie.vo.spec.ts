import { Cookie } from "../src/auth/cookie/cookie.vo";
import { VoValidationError } from "../src/errors/vo.error";

describe("Cookie", () => {
	describe("create", () => {
		it("maxAge로 쿠키를 생성할 수 있다", () => {
			// Given
			const maxAge = 3600000; // 1시간

			// When
			const cookie = Cookie.create(maxAge);

			// Then
			expect(cookie.maxAge).toBe(maxAge);
			expect(cookie.httpOnly).toBe(true);
			expect(cookie.sameSite).toBe("lax");
			expect(cookie.path).toBe("/");
		});

		it("production 환경에서는 secure가 true이다", () => {
			// Given
			const maxAge = 3600000;

			// When
			const cookie = Cookie.create(maxAge, true);

			// Then
			expect(cookie.secure).toBe(true);
		});

		it("non-production 환경에서는 secure가 false이다", () => {
			// Given
			const maxAge = 3600000;

			// When
			const cookie = Cookie.create(maxAge, false);

			// Then
			expect(cookie.secure).toBe(false);
		});

		it("maxAge가 0 이하이면 에러를 던진다", () => {
			// Given
			const maxAge = 0;

			// When & Then
			expect(() => Cookie.create(maxAge)).toThrow(VoValidationError);
			expect(() => Cookie.create(maxAge)).toThrow(
				"maxAge는 0보다 커야 합니다.",
			);
		});
	});

	describe("forToken", () => {
		it("문자열 만료 시간으로 쿠키를 생성할 수 있다 - 분 단위", () => {
			// Given
			const expiresIn = "15m";

			// When
			const cookie = Cookie.forToken(expiresIn, false);

			// Then
			expect(cookie.maxAge).toBe(15 * 60 * 1000); // 15분 = 900000ms
		});

		it("문자열 만료 시간으로 쿠키를 생성할 수 있다 - 시간 단위", () => {
			// Given
			const expiresIn = "1h";

			// When
			const cookie = Cookie.forToken(expiresIn, false);

			// Then
			expect(cookie.maxAge).toBe(60 * 60 * 1000); // 1시간 = 3600000ms
		});

		it("문자열 만료 시간으로 쿠키를 생성할 수 있다 - 일 단위", () => {
			// Given
			const expiresIn = "7d";

			// When
			const cookie = Cookie.forToken(expiresIn, false);

			// Then
			expect(cookie.maxAge).toBe(7 * 24 * 60 * 60 * 1000); // 7일
		});

		it("문자열 만료 시간으로 쿠키를 생성할 수 있다 - 초 단위", () => {
			// Given
			const expiresIn = "30s";

			// When
			const cookie = Cookie.forToken(expiresIn, false);

			// Then
			expect(cookie.maxAge).toBe(30 * 1000); // 30초 = 30000ms
		});

		it("숫자 만료 시간(초)으로 쿠키를 생성할 수 있다", () => {
			// Given
			const expiresIn = 3600; // 1시간 (초 단위)

			// When
			const cookie = Cookie.forToken(expiresIn, false);

			// Then
			expect(cookie.maxAge).toBe(3600 * 1000); // 3600000ms
		});

		it("유효하지 않은 만료 시간 형식이면 에러를 던진다", () => {
			// Given
			const invalidFormats = ["15min", "1hour", "7days", "abc", ""];

			// When & Then
			for (const format of invalidFormats) {
				expect(() => Cookie.forToken(format, false)).toThrow(VoValidationError);
			}
		});

		it("0 이하의 숫자는 에러를 던진다", () => {
			// Given
			const invalidNumbers = [0, -1, -100];

			// When & Then
			for (const num of invalidNumbers) {
				expect(() => Cookie.forToken(num, false)).toThrow(VoValidationError);
			}
		});
	});

	describe("toExpressOptions", () => {
		it("Express CookieOptions 형식으로 변환할 수 있다", () => {
			// Given
			const cookie = Cookie.forToken("1h", true);

			// When
			const options = cookie.toExpressOptions();

			// Then
			expect(options).toEqual({
				maxAge: 3600000,
				httpOnly: true,
				secure: true,
				sameSite: "lax",
				path: "/",
			});
		});
	});

	describe("equals", () => {
		it("같은 값의 쿠키는 동등하다", () => {
			// Given
			const cookie1 = Cookie.forToken("1h", false);
			const cookie2 = Cookie.forToken("1h", false);

			// When & Then
			expect(cookie1.equals(cookie2)).toBe(true);
		});

		it("다른 값의 쿠키는 동등하지 않다", () => {
			// Given
			const cookie1 = Cookie.forToken("1h", false);
			const cookie2 = Cookie.forToken("2h", false);

			// When & Then
			expect(cookie1.equals(cookie2)).toBe(false);
		});
	});
});
