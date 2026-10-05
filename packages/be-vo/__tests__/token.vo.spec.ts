import { AccessToken } from "../src/auth/token/access-token.vo";
import { RefreshToken } from "../src/auth/token/refresh-token.vo";
import { TokenPair } from "../src/auth/token/token-pair.vo";
import { VoValidationError } from "../src/errors/vo.error";

// 유효한 JWT 형식의 테스트 토큰
const VALID_ACCESS_TOKEN =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLTEyMyJ9.mock-signature";
const VALID_REFRESH_TOKEN =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLTEyMyIsInR5cGUiOiJyZWZyZXNoIn0.mock-signature";

describe("AccessToken", () => {
	describe("create", () => {
		it("유효한 JWT 형식의 토큰을 생성할 수 있다", () => {
			// Given & When
			const token = AccessToken.create(VALID_ACCESS_TOKEN);

			// Then
			expect(token.value).toBe(VALID_ACCESS_TOKEN);
		});

		it("유효하지 않은 JWT 형식은 에러를 던진다", () => {
			// Given
			const invalidTokens = [
				"invalid-token",
				"only.two.parts.here.extra",
				"no-dots-at-all",
				"",
			];

			// When & Then
			for (const invalidToken of invalidTokens) {
				expect(() => AccessToken.create(invalidToken)).toThrow(
					VoValidationError,
				);
			}
		});

		it("빈 토큰은 에러를 던진다", () => {
			// Given
			const emptyToken = "";

			// When & Then
			expect(() => AccessToken.create(emptyToken)).toThrow(VoValidationError);
			expect(() => AccessToken.create(emptyToken)).toThrow(
				"Access Token은 필수입니다.",
			);
		});
	});

	describe("toString", () => {
		it("토큰 값을 문자열로 반환한다", () => {
			// Given
			const token = AccessToken.create(VALID_ACCESS_TOKEN);

			// When
			const result = token.toString();

			// Then
			expect(result).toBe(VALID_ACCESS_TOKEN);
		});
	});

	describe("equals", () => {
		it("같은 값의 토큰은 동등하다", () => {
			// Given
			const token1 = AccessToken.create(VALID_ACCESS_TOKEN);
			const token2 = AccessToken.create(VALID_ACCESS_TOKEN);

			// When & Then
			expect(token1.equals(token2)).toBe(true);
		});

		it("다른 값의 토큰은 동등하지 않다", () => {
			// Given
			const token1 = AccessToken.create(VALID_ACCESS_TOKEN);
			const token2 = AccessToken.create(VALID_REFRESH_TOKEN);

			// When & Then
			expect(token1.equals(token2)).toBe(false);
		});
	});
});

describe("RefreshToken", () => {
	describe("create", () => {
		it("유효한 JWT 형식의 토큰을 생성할 수 있다", () => {
			// Given & When
			const token = RefreshToken.create(VALID_REFRESH_TOKEN);

			// Then
			expect(token.value).toBe(VALID_REFRESH_TOKEN);
		});

		it("유효하지 않은 JWT 형식은 에러를 던진다", () => {
			// Given
			const invalidToken = "invalid-token";

			// When & Then
			expect(() => RefreshToken.create(invalidToken)).toThrow(
				VoValidationError,
			);
			expect(() => RefreshToken.create(invalidToken)).toThrow(
				"유효하지 않은 JWT 형식입니다.",
			);
		});

		it("빈 토큰은 에러를 던진다", () => {
			// Given
			const emptyToken = "";

			// When & Then
			expect(() => RefreshToken.create(emptyToken)).toThrow(VoValidationError);
			expect(() => RefreshToken.create(emptyToken)).toThrow(
				"Refresh Token은 필수입니다.",
			);
		});
	});

	describe("toString", () => {
		it("토큰 값을 문자열로 반환한다", () => {
			// Given
			const token = RefreshToken.create(VALID_REFRESH_TOKEN);

			// When
			const result = token.toString();

			// Then
			expect(result).toBe(VALID_REFRESH_TOKEN);
		});
	});
});

describe("TokenPair", () => {
	describe("create", () => {
		it("AccessToken과 RefreshToken으로 쌍을 생성할 수 있다", () => {
			// Given
			const accessToken = AccessToken.create(VALID_ACCESS_TOKEN);
			const refreshToken = RefreshToken.create(VALID_REFRESH_TOKEN);

			// When
			const tokenPair = TokenPair.create(accessToken, refreshToken);

			// Then
			expect(tokenPair.accessToken).toBe(accessToken);
			expect(tokenPair.refreshToken).toBe(refreshToken);
		});
	});

	describe("fromStrings", () => {
		it("문자열로부터 TokenPair를 생성할 수 있다", () => {
			// Given & When
			const tokenPair = TokenPair.fromStrings(
				VALID_ACCESS_TOKEN,
				VALID_REFRESH_TOKEN,
			);

			// Then
			expect(tokenPair.accessToken.value).toBe(VALID_ACCESS_TOKEN);
			expect(tokenPair.refreshToken.value).toBe(VALID_REFRESH_TOKEN);
		});

		it("유효하지 않은 Access Token 문자열은 에러를 던진다", () => {
			// Given
			const invalidAccessToken = "invalid";

			// When & Then
			expect(() =>
				TokenPair.fromStrings(invalidAccessToken, VALID_REFRESH_TOKEN),
			).toThrow(VoValidationError);
		});

		it("유효하지 않은 Refresh Token 문자열은 에러를 던진다", () => {
			// Given
			const invalidRefreshToken = "invalid";

			// When & Then
			expect(() =>
				TokenPair.fromStrings(VALID_ACCESS_TOKEN, invalidRefreshToken),
			).toThrow(VoValidationError);
		});
	});

	describe("toObject", () => {
		it("객체 형태로 변환할 수 있다", () => {
			// Given
			const tokenPair = TokenPair.fromStrings(
				VALID_ACCESS_TOKEN,
				VALID_REFRESH_TOKEN,
			);

			// When
			const result = tokenPair.toObject();

			// Then
			expect(result).toEqual({
				accessToken: VALID_ACCESS_TOKEN,
				refreshToken: VALID_REFRESH_TOKEN,
			});
		});
	});

	describe("equals", () => {
		it("같은 토큰 쌍은 동등하다", () => {
			// Given
			const tokenPair1 = TokenPair.fromStrings(
				VALID_ACCESS_TOKEN,
				VALID_REFRESH_TOKEN,
			);
			const tokenPair2 = TokenPair.fromStrings(
				VALID_ACCESS_TOKEN,
				VALID_REFRESH_TOKEN,
			);

			// When & Then
			expect(tokenPair1.equals(tokenPair2)).toBe(true);
		});

		it("다른 토큰 쌍은 동등하지 않다", () => {
			// Given
			const differentAccessToken =
				"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLTQ1NiJ9.different";
			const tokenPair1 = TokenPair.fromStrings(
				VALID_ACCESS_TOKEN,
				VALID_REFRESH_TOKEN,
			);
			const tokenPair2 = TokenPair.fromStrings(
				differentAccessToken,
				VALID_REFRESH_TOKEN,
			);

			// When & Then
			expect(tokenPair1.equals(tokenPair2)).toBe(false);
		});
	});
});
