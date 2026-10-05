import { HashedPassword } from "../src/auth/password/hashed-password.vo";
import { PlainPassword } from "../src/auth/password/plain-password.vo";
import { VoValidationError } from "../src/errors/vo.error";

describe("PlainPassword", () => {
	describe("create", () => {
		it("유효한 비밀번호를 생성할 수 있다", () => {
			// Given
			const password = "Password123!";

			// When
			const plainPassword = PlainPassword.create(password);

			// Then
			expect(plainPassword.value).toBe(password);
		});

		it("8자 이상의 비밀번호를 허용한다", () => {
			// Given
			const password = "12345678";

			// When
			const plainPassword = PlainPassword.create(password);

			// Then
			expect(plainPassword.value).toBe(password);
		});

		it("8자 미만의 비밀번호는 에러를 던진다", () => {
			// Given
			const password = "1234567";

			// When & Then
			expect(() => PlainPassword.create(password)).toThrow(VoValidationError);
			expect(() => PlainPassword.create(password)).toThrow(
				"비밀번호는 최소 8자 이상이어야 합니다.",
			);
		});

		it("72자 초과의 비밀번호는 에러를 던진다", () => {
			// Given
			const password = "a".repeat(73);

			// When & Then
			expect(() => PlainPassword.create(password)).toThrow(VoValidationError);
			expect(() => PlainPassword.create(password)).toThrow(
				"비밀번호는 최대 72자를 초과할 수 없습니다.",
			);
		});

		it("빈 비밀번호는 에러를 던진다", () => {
			// Given
			const password = "";

			// When & Then
			expect(() => PlainPassword.create(password)).toThrow(VoValidationError);
			expect(() => PlainPassword.create(password)).toThrow(
				"비밀번호는 필수입니다.",
			);
		});

		it("허용되지 않은 문자가 포함된 비밀번호는 에러를 던진다", () => {
			// Given
			const password = "password한글";

			// When & Then
			expect(() => PlainPassword.create(password)).toThrow(VoValidationError);
			expect(() => PlainPassword.create(password)).toThrow(
				"비밀번호는 영문, 숫자, 특수문자만 포함할 수 있습니다.",
			);
		});
	});

	describe("toString", () => {
		it("보안을 위해 마스킹된 문자열을 반환한다", () => {
			// Given
			const plainPassword = PlainPassword.create("Password123!");

			// When
			const result = plainPassword.toString();

			// Then
			expect(result).toBe("********");
		});
	});

	describe("equals", () => {
		it("같은 값의 비밀번호는 동등하다", () => {
			// Given
			const password1 = PlainPassword.create("Password123!");
			const password2 = PlainPassword.create("Password123!");

			// When & Then
			expect(password1.equals(password2)).toBe(true);
		});

		it("다른 값의 비밀번호는 동등하지 않다", () => {
			// Given
			const password1 = PlainPassword.create("Password123!");
			const password2 = PlainPassword.create("Password456!");

			// When & Then
			expect(password1.equals(password2)).toBe(false);
		});
	});
});

describe("HashedPassword", () => {
	// bcrypt 해시 예시 (실제 "Password123!" 해시)
	const VALID_BCRYPT_HASH =
		"$2b$10$N9qo8uLOickgx2ZMRZoMye.IjqQBrkHx28nkoXs3lTbTQMWNl5Tq.";

	describe("fromHash", () => {
		it("유효한 bcrypt 해시로 생성할 수 있다", () => {
			// Given & When
			const hashedPassword = HashedPassword.fromHash(VALID_BCRYPT_HASH);

			// Then
			expect(hashedPassword.value).toBe(VALID_BCRYPT_HASH);
		});

		it("유효하지 않은 해시 형식은 에러를 던진다", () => {
			// Given
			const invalidHash = "not-a-valid-hash";

			// When & Then
			expect(() => HashedPassword.fromHash(invalidHash)).toThrow(
				VoValidationError,
			);
			expect(() => HashedPassword.fromHash(invalidHash)).toThrow(
				"유효하지 않은 bcrypt 해시 형식입니다.",
			);
		});

		it("빈 해시는 에러를 던진다", () => {
			// Given
			const emptyHash = "";

			// When & Then
			expect(() => HashedPassword.fromHash(emptyHash)).toThrow(
				VoValidationError,
			);
			expect(() => HashedPassword.fromHash(emptyHash)).toThrow(
				"해시된 비밀번호는 필수입니다.",
			);
		});
	});

	describe("fromPlain", () => {
		it("평문 비밀번호를 해시할 수 있다 (비동기)", async () => {
			// Given
			const plainPassword = PlainPassword.create("Password123!");

			// When
			const hashedPassword = await HashedPassword.fromPlain(plainPassword);

			// Then
			expect(hashedPassword.value).toMatch(/^\$2[aby]\$\d{2}\$.{53}$/);
		});
	});

	describe("fromPlainSync", () => {
		it("평문 비밀번호를 해시할 수 있다 (동기)", () => {
			// Given
			const plainPassword = PlainPassword.create("Password123!");

			// When
			const hashedPassword = HashedPassword.fromPlainSync(plainPassword);

			// Then
			expect(hashedPassword.value).toMatch(/^\$2[aby]\$\d{2}\$.{53}$/);
		});
	});

	describe("compare", () => {
		it("올바른 비밀번호를 검증할 수 있다", async () => {
			// Given
			const plainPassword = PlainPassword.create("Password123!");
			const hashedPassword = await HashedPassword.fromPlain(plainPassword);

			// When
			const isValid = await hashedPassword.compare(plainPassword);

			// Then
			expect(isValid).toBe(true);
		});

		it("틀린 비밀번호는 false를 반환한다", async () => {
			// Given
			const correctPassword = PlainPassword.create("Password123!");
			const wrongPassword = PlainPassword.create("WrongPassword!");
			const hashedPassword = await HashedPassword.fromPlain(correctPassword);

			// When
			const isValid = await hashedPassword.compare(wrongPassword);

			// Then
			expect(isValid).toBe(false);
		});
	});

	describe("toString", () => {
		it("보안을 위해 마스킹된 문자열을 반환한다", () => {
			// Given
			const hashedPassword = HashedPassword.fromHash(VALID_BCRYPT_HASH);

			// When
			const result = hashedPassword.toString();

			// Then
			expect(result).toBe("[HASHED]");
		});
	});
});
