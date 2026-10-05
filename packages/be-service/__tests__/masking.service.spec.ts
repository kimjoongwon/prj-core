import { MASKING_PRESETS } from "@cocrepo/constant";
import type { ActionConfig, ActionMaskingConfig } from "@cocrepo/type";
import { Test, TestingModule } from "@nestjs/testing";
import { MaskingService } from "../src/masking/masking.service";

describe("MaskingService", () => {
	let service: MaskingService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [MaskingService],
		}).compile();

		service = module.get<MaskingService>(MaskingService);
	});

	it("서비스가 정의되어야 한다", () => {
		expect(service).toBeDefined();
	});

	describe("applyMasking - 프리셋 마스킹", () => {
		describe("PRESET_EMAIL", () => {
			const emailConfig: ActionMaskingConfig = {
				type: "masking",
				preset: MASKING_PRESETS.EMAIL,
			};

			it("이메일 주소를 마스킹해야 한다: minsu.kim92@gmail.com -> min***@gmail.com", () => {
				// Given
				const email = "minsu.kim92@gmail.com";

				// When
				const result = service.applyMasking(email, emailConfig);

				// Then
				expect(result).toBe("min***@gmail.com");
			});

			it("짧은 로컬 파트를 마스킹해야 한다: ab@test.com -> ab***@test.com", () => {
				// Given
				const email = "ab@test.com";

				// When
				const result = service.applyMasking(email, emailConfig);

				// Then
				expect(result).toBe("ab***@test.com");
			});

			it("한 글자 로컬 파트를 마스킹해야 한다: a@test.com -> a***@test.com", () => {
				// Given
				const email = "a@test.com";

				// When
				const result = service.applyMasking(email, emailConfig);

				// Then
				expect(result).toBe("a***@test.com");
			});

			it("@가 없는 문자열은 처음 3자 남기고 마스킹해야 한다", () => {
				// Given
				const invalidEmail = "notanemail";

				// When
				const result = service.applyMasking(invalidEmail, emailConfig);

				// Then
				expect(result).toBe("not***");
			});

			it("3자 이하의 @가 없는 문자열은 그대로 반환해야 한다", () => {
				// Given
				const shortString = "abc";

				// When
				const result = service.applyMasking(shortString, emailConfig);

				// Then
				expect(result).toBe("abc");
			});
		});

		describe("PRESET_PHONE", () => {
			const phoneConfig: ActionMaskingConfig = {
				type: "masking",
				preset: MASKING_PRESETS.PHONE,
			};

			it("하이픈 포함 전화번호를 마스킹해야 한다: 010-5678-9012 -> 010-****-9012", () => {
				// Given
				const phone = "010-5678-9012";

				// When
				const result = service.applyMasking(phone, phoneConfig);

				// Then
				expect(result).toBe("010-****-9012");
			});

			it("숫자만 있는 전화번호를 마스킹해야 한다: 01056789012 -> 010****9012", () => {
				// Given
				const phone = "01056789012";

				// When
				const result = service.applyMasking(phone, phoneConfig);

				// Then
				expect(result).toBe("010****9012");
			});

			it("지역번호가 있는 전화번호를 마스킹해야 한다: 02-1234-5678 -> 02-****-5678", () => {
				// Given
				const phone = "02-1234-5678";

				// When
				const result = service.applyMasking(phone, phoneConfig);

				// Then
				expect(result).toBe("02-****-5678");
			});

			it("7자리 이상의 다른 형식 전화번호는 가운데 부분을 마스킹해야 한다", () => {
				// Given
				const phone = "1234567890";

				// When
				const result = service.applyMasking(phone, phoneConfig);

				// Then
				expect(result).toBe("123****7890");
			});

			it("7자리 미만의 전화번호는 그대로 반환해야 한다", () => {
				// Given
				const phone = "123456";

				// When
				const result = service.applyMasking(phone, phoneConfig);

				// Then
				expect(result).toBe("123456");
			});
		});

		describe("PRESET_NAME", () => {
			const nameConfig: ActionMaskingConfig = {
				type: "masking",
				preset: MASKING_PRESETS.NAME,
			};

			it("3글자 이름을 마스킹해야 한다: 김민수 -> 김*수", () => {
				// Given
				const name = "김민수";

				// When
				const result = service.applyMasking(name, nameConfig);

				// Then
				expect(result).toBe("김*수");
			});

			it("2글자 이름을 마스킹해야 한다: 김수 -> 김*", () => {
				// Given
				const name = "김수";

				// When
				const result = service.applyMasking(name, nameConfig);

				// Then
				expect(result).toBe("김*");
			});

			it("4글자 이름을 마스킹해야 한다: 남궁민수 -> 남**수", () => {
				// Given
				const name = "남궁민수";

				// When
				const result = service.applyMasking(name, nameConfig);

				// Then
				expect(result).toBe("남**수");
			});

			it("1글자 이름은 그대로 반환해야 한다", () => {
				// Given
				const name = "김";

				// When
				const result = service.applyMasking(name, nameConfig);

				// Then
				expect(result).toBe("김");
			});

			it("영문 이름을 마스킹해야 한다: John -> J**n", () => {
				// Given
				const name = "John";

				// When
				const result = service.applyMasking(name, nameConfig);

				// Then
				expect(result).toBe("J**n");
			});
		});

		describe("PRESET_SSN", () => {
			const ssnConfig: ActionMaskingConfig = {
				type: "masking",
				preset: MASKING_PRESETS.SSN,
			};

			it("하이픈 포함 주민등록번호를 마스킹해야 한다: 920315-1234567 -> 920315-*******", () => {
				// Given
				const ssn = "920315-1234567";

				// When
				const result = service.applyMasking(ssn, ssnConfig);

				// Then
				expect(result).toBe("920315-*******");
			});

			it("하이픈 없는 주민등록번호를 마스킹해야 한다: 9203151234567 -> 920315-*******", () => {
				// Given
				const ssn = "9203151234567";

				// When
				const result = service.applyMasking(ssn, ssnConfig);

				// Then
				expect(result).toBe("920315-*******");
			});

			it("6자리 이상의 다른 형식도 뒷부분을 마스킹해야 한다", () => {
				// Given
				const ssn = "123456789";

				// When
				const result = service.applyMasking(ssn, ssnConfig);

				// Then
				expect(result).toBe("123456-*******");
			});

			it("6자리 이하는 그대로 반환해야 한다", () => {
				// Given
				const ssn = "123456";

				// When
				const result = service.applyMasking(ssn, ssnConfig);

				// Then
				expect(result).toBe("123456");
			});
		});

		describe("PRESET_CARD", () => {
			const cardConfig: ActionMaskingConfig = {
				type: "masking",
				preset: MASKING_PRESETS.CARD,
			};

			it("하이픈 포함 카드번호를 마스킹해야 한다: 1234-5678-9012-3456 -> 1234-****-****-3456", () => {
				// Given
				const card = "1234-5678-9012-3456";

				// When
				const result = service.applyMasking(card, cardConfig);

				// Then
				expect(result).toBe("1234-****-****-3456");
			});

			it("숫자만 있는 카드번호를 마스킹해야 한다: 1234567890123456 -> 1234********3456", () => {
				// Given
				const card = "1234567890123456";

				// When
				const result = service.applyMasking(card, cardConfig);

				// Then
				expect(result).toBe("1234********3456");
			});

			it("12자리 이상의 다른 형식 카드번호도 마스킹해야 한다", () => {
				// Given
				const card = "123456789012345";

				// When
				const result = service.applyMasking(card, cardConfig);

				// Then
				expect(result).toBe("1234-****-****-2345");
			});

			it("12자리 미만의 카드번호는 그대로 반환해야 한다", () => {
				// Given
				const card = "12345678901";

				// When
				const result = service.applyMasking(card, cardConfig);

				// Then
				expect(result).toBe("12345678901");
			});
		});

		describe("PRESET_ACCOUNT", () => {
			const accountConfig: ActionMaskingConfig = {
				type: "masking",
				preset: MASKING_PRESETS.ACCOUNT,
			};

			it("하이픈 포함 계좌번호를 마스킹해야 한다: 110-123-456789 -> 110-***-******", () => {
				// Given
				const account = "110-123-456789";

				// When
				const result = service.applyMasking(account, accountConfig);

				// Then
				expect(result).toBe("110-***-******");
			});

			it("두 개의 하이픈이 있는 계좌번호를 마스킹해야 한다: 123-45-6789 -> 123-**-****", () => {
				// Given
				const account = "123-45-6789";

				// When
				const result = service.applyMasking(account, accountConfig);

				// Then
				expect(result).toBe("123-**-****");
			});

			it("하이픈 없는 계좌번호를 마스킹해야 한다: 1234567890123 -> 123**********", () => {
				// Given
				const account = "1234567890123";

				// When
				const result = service.applyMasking(account, accountConfig);

				// Then
				expect(result).toBe("123**********");
			});

			it("3자리 이하의 계좌번호는 그대로 반환해야 한다", () => {
				// Given
				const account = "123";

				// When
				const result = service.applyMasking(account, accountConfig);

				// Then
				expect(result).toBe("123");
			});
		});

		describe("알 수 없는 프리셋", () => {
			it("알 수 없는 프리셋일 때 원본을 반환해야 한다", () => {
				// Given
				const value = "test-value";
				const config: ActionMaskingConfig = {
					type: "masking",
					preset: "UNKNOWN_PRESET",
				};

				// When
				const result = service.applyMasking(value, config);

				// Then
				expect(result).toBe("test-value");
			});
		});
	});

	describe("applyMasking - 커스텀 패턴 마스킹", () => {
		it("커스텀 패턴으로 마스킹해야 한다", () => {
			// Given
			const value = "홍길동입니다";
			const config: ActionMaskingConfig = {
				type: "masking",
				pattern: "^(.{3}).*(.{2})$",
				replacement: "$1***$2",
			};

			// When
			const result = service.applyMasking(value, config);

			// Then
			expect(result).toBe("홍길동***니다");
		});

		it("첫 번째와 마지막 문자만 남기는 커스텀 패턴", () => {
			// Given
			const value = "테스트문자열";
			const config: ActionMaskingConfig = {
				type: "masking",
				pattern: "^(.).*?(.)$",
				replacement: "$1****$2",
			};

			// When
			const result = service.applyMasking(value, config);

			// Then
			expect(result).toBe("테****열");
		});

		it("잘못된 정규식 패턴일 때 원본을 반환해야 한다", () => {
			// Given
			const value = "test-value";
			const config: ActionMaskingConfig = {
				type: "masking",
				pattern: "[invalid(regex",
				replacement: "$1",
			};

			// When
			const result = service.applyMasking(value, config);

			// Then
			expect(result).toBe("test-value");
		});
	});

	describe("applyMasking - 엣지 케이스", () => {
		it("null 값은 빈 문자열을 반환해야 한다", () => {
			// Given
			const config: ActionMaskingConfig = {
				type: "masking",
				preset: MASKING_PRESETS.EMAIL,
			};

			// When
			const result = service.applyMasking(null as unknown as string, config);

			// Then
			expect(result).toBe("");
		});

		it("undefined 값은 빈 문자열을 반환해야 한다", () => {
			// Given
			const config: ActionMaskingConfig = {
				type: "masking",
				preset: MASKING_PRESETS.EMAIL,
			};

			// When
			const result = service.applyMasking(
				undefined as unknown as string,
				config,
			);

			// Then
			expect(result).toBe("");
		});

		it("빈 문자열은 빈 문자열을 반환해야 한다", () => {
			// Given
			const config: ActionMaskingConfig = {
				type: "masking",
				preset: MASKING_PRESETS.EMAIL,
			};

			// When
			const result = service.applyMasking("", config);

			// Then
			expect(result).toBe("");
		});

		it("마스킹 설정이 아닌 config는 원본을 반환해야 한다", () => {
			// Given
			const value = "test-value";
			const config: ActionConfig = {
				type: "format",
				pattern: "YYYY-MM-DD",
			};

			// When
			const result = service.applyMasking(value, config);

			// Then
			expect(result).toBe("test-value");
		});

		it("config가 null이면 원본을 반환해야 한다", () => {
			// Given
			const value = "test-value";

			// When
			const result = service.applyMasking(value, null);

			// Then
			expect(result).toBe("test-value");
		});

		it("불완전한 마스킹 설정은 원본을 반환해야 한다", () => {
			// Given
			const value = "test-value";
			const config: ActionMaskingConfig = {
				type: "masking",
				// preset도 pattern/replacement도 없음
			};

			// When
			const result = service.applyMasking(value, config);

			// Then
			expect(result).toBe("test-value");
		});
	});

	describe("maskFields", () => {
		it("객체의 특정 필드들을 마스킹해야 한다", () => {
			// Given
			const user = {
				name: "김민수",
				email: "minsu.kim92@gmail.com",
				age: 30,
			};
			const fieldsToMask = new Map<string, ActionConfig>([
				["name", { type: "masking", preset: MASKING_PRESETS.NAME }],
				["email", { type: "masking", preset: MASKING_PRESETS.EMAIL }],
			]);

			// When
			const result = service.maskFields(user, fieldsToMask);

			// Then
			expect(result).toEqual({
				name: "김*수",
				email: "min***@gmail.com",
				age: 30,
			});
		});

		it("원본 객체를 수정하지 않아야 한다", () => {
			// Given
			const user = {
				name: "김민수",
				email: "test@example.com",
			};
			const fieldsToMask = new Map<string, ActionConfig>([
				["name", { type: "masking", preset: MASKING_PRESETS.NAME }],
			]);

			// When
			const result = service.maskFields(user, fieldsToMask);

			// Then
			expect(user.name).toBe("김민수"); // 원본 유지
			expect(result.name).toBe("김*수"); // 결과는 마스킹됨
		});

		it("존재하지 않는 필드는 무시해야 한다", () => {
			// Given
			const user = {
				name: "김민수",
			};
			const fieldsToMask = new Map<string, ActionConfig>([
				["name", { type: "masking", preset: MASKING_PRESETS.NAME }],
				["email", { type: "masking", preset: MASKING_PRESETS.EMAIL }], // 존재하지 않는 필드
			]);

			// When
			const result = service.maskFields(user, fieldsToMask);

			// Then
			expect(result).toEqual({
				name: "김*수",
			});
		});

		it("문자열이 아닌 필드는 마스킹하지 않아야 한다", () => {
			// Given
			const user = {
				name: "김민수",
				age: 30,
				isActive: true,
			};
			const fieldsToMask = new Map<string, ActionConfig>([
				["name", { type: "masking", preset: MASKING_PRESETS.NAME }],
				["age", { type: "masking", preset: MASKING_PRESETS.NAME }],
				["isActive", { type: "masking", preset: MASKING_PRESETS.NAME }],
			]);

			// When
			const result = service.maskFields(user, fieldsToMask);

			// Then
			expect(result).toEqual({
				name: "김*수",
				age: 30, // 숫자는 마스킹되지 않음
				isActive: true, // boolean도 마스킹되지 않음
			});
		});

		it("null/undefined 데이터는 그대로 반환해야 한다", () => {
			// Given
			const fieldsToMask = new Map<string, ActionConfig>([
				["name", { type: "masking", preset: MASKING_PRESETS.NAME }],
			]);

			// When
			const nullResult = service.maskFields(
				null as unknown as Record<string, unknown>,
				fieldsToMask,
			);
			const undefinedResult = service.maskFields(
				undefined as unknown as Record<string, unknown>,
				fieldsToMask,
			);

			// Then
			expect(nullResult).toBeNull();
			expect(undefinedResult).toBeUndefined();
		});
	});

	describe("maskFieldsArray", () => {
		it("배열의 각 객체에 마스킹을 적용해야 한다", () => {
			// Given
			const users = [
				{ name: "김민수", email: "minsu@example.com" },
				{ name: "이영희", email: "younghee@example.com" },
				{ name: "박철수", email: "cheolsu@example.com" },
			];
			const fieldsToMask = new Map<string, ActionConfig>([
				["name", { type: "masking", preset: MASKING_PRESETS.NAME }],
				["email", { type: "masking", preset: MASKING_PRESETS.EMAIL }],
			]);

			// When
			const result = service.maskFieldsArray(users, fieldsToMask);

			// Then
			expect(result).toEqual([
				{ name: "김*수", email: "min***@example.com" },
				{ name: "이*희", email: "you***@example.com" },
				{ name: "박*수", email: "che***@example.com" },
			]);
		});

		it("빈 배열은 빈 배열을 반환해야 한다", () => {
			// Given
			const users: Record<string, unknown>[] = [];
			const fieldsToMask = new Map<string, ActionConfig>([
				["name", { type: "masking", preset: MASKING_PRESETS.NAME }],
			]);

			// When
			const result = service.maskFieldsArray(users, fieldsToMask);

			// Then
			expect(result).toEqual([]);
		});

		it("배열이 아닌 값은 그대로 반환해야 한다", () => {
			// Given
			const notArray = "not-an-array";
			const fieldsToMask = new Map<string, ActionConfig>([
				["name", { type: "masking", preset: MASKING_PRESETS.NAME }],
			]);

			// When
			const result = service.maskFieldsArray(
				notArray as unknown as Record<string, unknown>[],
				fieldsToMask,
			);

			// Then
			expect(result).toBe("not-an-array");
		});
	});
});
