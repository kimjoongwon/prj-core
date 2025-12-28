import { Email, Password, Phone, String, UUID } from "../../decorators";

/**
 * 회원가입 스키마
 *
 * 프론트엔드/백엔드 공유 검증 규칙
 *
 * @example
 * ```typescript
 * // 프론트엔드
 * import { SignUpSchema, validateSchema } from '@cocrepo/schema';
 * const result = await validateSchema(SignUpSchema, formData);
 *
 * // 백엔드 (DTO에서 extend)
 * class SignUpPayloadDto extends SignUpSchema { ... }
 * ```
 */
export class SignUpSchema {
	@String({ minLength: 2, maxLength: 50 })
	nickname: string;

	@UUID()
	spaceId: string;

	@Email()
	email: string;

	@String({ minLength: 2, maxLength: 50 })
	name: string;

	@Phone()
	phone: string;

	@Password({ minLength: 8 })
	password: string;
}
