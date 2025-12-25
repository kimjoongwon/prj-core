import { ArgumentMetadata, BadRequestException } from "@nestjs/common";
import { IsEmail, IsOptional, IsString } from "class-validator";
import { CustomValidationPipe } from "./custom-validation.pipe";

// 테스트용 DTO 클래스 (content 필드 포함)
class TestContentDto {
	@IsString()
	@IsOptional()
	name?: string;

	@IsOptional()
	content?: any;
}

// 테스트용 DTO 클래스 (유효성 검사용)
class TestValidationDto {
	@IsString()
	name: string;

	@IsEmail()
	email: string;
}

describe("CustomValidationPipe", () => {
	let pipe: CustomValidationPipe;

	beforeEach(() => {
		pipe = new CustomValidationPipe();
	});

	it("파이프가 정의되어야 한다", () => {
		expect(pipe).toBeDefined();
	});

	describe("transform - content 처리", () => {
		const contentMetadata: ArgumentMetadata = {
			type: "body",
			metatype: TestContentDto,
			data: undefined,
		};

		it("content 필드가 있으면 JSON 파싱해야 한다", async () => {
			// Given
			const contentObject = { title: "Test", description: "Test description" };
			const value = {
				name: "test",
				content: JSON.stringify(contentObject),
			};

			// When
			const result = await pipe.transform(value, contentMetadata);

			// Then
			expect(result.content).toEqual(contentObject);
		});

		it("content 필드가 없으면 그대로 반환해야 한다", async () => {
			// Given
			const value = { name: "test" };

			// When
			const result = await pipe.transform(value, contentMetadata);

			// Then
			expect(result.content).toBeUndefined();
		});

		it("중첩된 content 객체를 파싱해야 한다", async () => {
			// Given
			const nestedContent = {
				items: [
					{ id: 1, name: "item1" },
					{ id: 2, name: "item2" },
				],
				metadata: {
					total: 2,
				},
			};
			const value = {
				name: "Test",
				content: JSON.stringify(nestedContent),
			};

			// When
			const result = await pipe.transform(value, contentMetadata);

			// Then
			expect(result.content).toEqual(nestedContent);
			expect(result.content.items).toHaveLength(2);
		});

		it("다른 필드는 유지되어야 한다", async () => {
			// Given
			const value = {
				name: "test",
				content: JSON.stringify({ data: "test" }),
			};

			// When
			const result = await pipe.transform(value, contentMetadata);

			// Then
			expect(result.name).toBe("test");
			expect(result.content).toEqual({ data: "test" });
		});

		it("유효하지 않은 JSON content가 있으면 에러를 발생시켜야 한다", async () => {
			// Given
			const value = {
				name: "test",
				content: "invalid-json{",
			};

			// When & Then
			await expect(pipe.transform(value, contentMetadata)).rejects.toThrow();
		});

		it("빈 문자열 content는 falsy이므로 그대로 반환해야 한다", async () => {
			// Given
			const value = {
				name: "test",
				content: "",
			};

			// When
			const result = await pipe.transform(value, contentMetadata);

			// Then - 빈 문자열은 falsy이므로 content 처리 로직을 건너뜀
			expect(result.content).toBe("");
		});
	});

	describe("transform - 기본 동작", () => {
		const noMetatype: ArgumentMetadata = {
			type: "body",
			metatype: undefined,
			data: undefined,
		};

		it("null 값도 처리해야 한다", async () => {
			// Given
			const value = null;

			// When
			const result = await pipe.transform(value, noMetatype);

			// Then
			expect(result).toBeNull();
		});

		it("undefined 값도 처리해야 한다", async () => {
			// Given
			const value = undefined;

			// When
			const result = await pipe.transform(value, noMetatype);

			// Then
			expect(result).toBeUndefined();
		});

		it("빈 객체도 처리해야 한다", async () => {
			// Given
			const value = {};

			// When
			const result = await pipe.transform(value, noMetatype);

			// Then
			expect(result).toBeDefined();
		});
	});

	describe("ValidationPipe 옵션 동작", () => {
		const dtoMetadata: ArgumentMetadata = {
			type: "body",
			metatype: TestValidationDto,
			data: undefined,
		};

		it("forbidNonWhitelisted: 허용되지 않은 속성이 있으면 에러를 발생시켜야 한다", async () => {
			// Given
			const value = {
				name: "test",
				email: "test@example.com",
				unknownField: "not allowed",
			};

			// When & Then
			await expect(pipe.transform(value, dtoMetadata)).rejects.toThrow(
				BadRequestException,
			);
		});

		it("transform: 입력값이 올바른 타입으로 변환되어야 한다", async () => {
			// Given
			const value = {
				name: "test",
				email: "test@example.com",
			};

			// When
			const result = await pipe.transform(value, dtoMetadata);

			// Then
			expect(result).toBeInstanceOf(TestValidationDto);
			expect(result.name).toBe("test");
			expect(result.email).toBe("test@example.com");
		});

		it("유효성 검사 실패 시 BadRequestException을 발생시켜야 한다", async () => {
			// Given
			const value = {
				name: "test",
				email: "invalid-email",
			};

			// When & Then
			await expect(pipe.transform(value, dtoMetadata)).rejects.toThrow(
				BadRequestException,
			);
		});

		it("필수 필드가 없으면 BadRequestException을 발생시켜야 한다", async () => {
			// Given
			const value = {
				name: "test",
			};

			// When & Then
			await expect(pipe.transform(value, dtoMetadata)).rejects.toThrow(
				BadRequestException,
			);
		});
	});
});
