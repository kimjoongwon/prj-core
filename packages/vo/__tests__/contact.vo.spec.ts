import { Email } from "../src/contact/email.vo";
import { Phone } from "../src/contact/phone.vo";
import { VoValidationError } from "../src/errors/vo.error";

describe("Email", () => {
	describe("create", () => {
		it("유효한 이메일을 생성할 수 있다", () => {
			// Given
			const emailStr = "user@example.com";

			// When
			const email = Email.create(emailStr);

			// Then
			expect(email.value).toBe(emailStr);
		});

		it("대문자 이메일을 소문자로 변환한다", () => {
			// Given
			const emailStr = "User@Example.COM";

			// When
			const email = Email.create(emailStr);

			// Then
			expect(email.value).toBe("user@example.com");
		});

		it("앞뒤 공백을 제거한다", () => {
			// Given
			const emailStr = "  user@example.com  ";

			// When
			const email = Email.create(emailStr);

			// Then
			expect(email.value).toBe("user@example.com");
		});

		it("유효하지 않은 이메일 형식은 에러를 던진다", () => {
			// Given
			const invalidEmails = [
				"invalid",
				"@example.com",
				"user@",
				"user@.com",
				"user@@example.com",
			];

			// When & Then
			for (const invalidEmail of invalidEmails) {
				expect(() => Email.create(invalidEmail)).toThrow(VoValidationError);
			}
		});

		it("빈 이메일은 에러를 던진다", () => {
			// Given
			const emptyEmail = "";

			// When & Then
			expect(() => Email.create(emptyEmail)).toThrow(VoValidationError);
			expect(() => Email.create(emptyEmail)).toThrow("이메일은 필수입니다.");
		});
	});

	describe("getDomain", () => {
		it("도메인을 추출할 수 있다", () => {
			// Given
			const email = Email.create("user@example.com");

			// When
			const domain = email.getDomain();

			// Then
			expect(domain).toBe("example.com");
		});
	});

	describe("getLocalPart", () => {
		it("로컬 파트를 추출할 수 있다", () => {
			// Given
			const email = Email.create("user@example.com");

			// When
			const localPart = email.getLocalPart();

			// Then
			expect(localPart).toBe("user");
		});
	});

	describe("toString", () => {
		it("이메일 값을 문자열로 반환한다", () => {
			// Given
			const email = Email.create("user@example.com");

			// When
			const result = email.toString();

			// Then
			expect(result).toBe("user@example.com");
		});
	});

	describe("equals", () => {
		it("같은 이메일은 동등하다", () => {
			// Given
			const email1 = Email.create("user@example.com");
			const email2 = Email.create("USER@EXAMPLE.COM");

			// When & Then
			expect(email1.equals(email2)).toBe(true);
		});

		it("다른 이메일은 동등하지 않다", () => {
			// Given
			const email1 = Email.create("user1@example.com");
			const email2 = Email.create("user2@example.com");

			// When & Then
			expect(email1.equals(email2)).toBe(false);
		});
	});
});

describe("Phone", () => {
	// 국제 형식 전화번호 사용 (libphonenumber-js 호환)
	const VALID_PHONE_INTL = "+821012345678";
	const VALID_PHONE_INTL_2 = "+821098765432";

	describe("create", () => {
		it("국제 형식 번호를 생성할 수 있다", () => {
			// Given
			const phoneStr = VALID_PHONE_INTL;

			// When
			const phone = Phone.create(phoneStr);

			// Then
			expect(phone.normalized).toBe("+821012345678");
			expect(phone.value).toBe(phoneStr);
		});

		it("유효하지 않은 전화번호는 에러를 던진다", () => {
			// Given
			const invalidPhones = ["123", "abcd"];

			// When & Then
			for (const invalidPhone of invalidPhones) {
				expect(() => Phone.create(invalidPhone)).toThrow(VoValidationError);
			}
		});

		it("빈 전화번호는 에러를 던진다", () => {
			// Given
			const emptyPhone = "";

			// When & Then
			expect(() => Phone.create(emptyPhone)).toThrow(VoValidationError);
		});
	});

	describe("toString", () => {
		it("E.164 형식을 문자열로 반환한다", () => {
			// Given
			const phone = Phone.create(VALID_PHONE_INTL);

			// When
			const result = phone.toString();

			// Then
			expect(result).toBe("+821012345678");
		});
	});

	describe("equals", () => {
		it("같은 전화번호는 동등하다", () => {
			// Given
			const phone1 = Phone.create(VALID_PHONE_INTL);
			const phone2 = Phone.create(VALID_PHONE_INTL);

			// When & Then
			expect(phone1.equals(phone2)).toBe(true);
		});

		it("다른 전화번호는 동등하지 않다", () => {
			// Given
			const phone1 = Phone.create(VALID_PHONE_INTL);
			const phone2 = Phone.create(VALID_PHONE_INTL_2);

			// When & Then
			expect(phone1.equals(phone2)).toBe(false);
		});
	});
});
