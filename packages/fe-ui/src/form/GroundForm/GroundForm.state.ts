import type {
	GroundDto,
	LanguageCode,
	UpdateGroundDto,
} from "@cocrepo/api/core/model";

export type GroundFormField =
	| "name"
	| "label"
	| "address"
	| "phone"
	| "email"
	| "businessNo"
	| "contentLanguageCode";

export type GroundFormResponseDto = Pick<
	GroundDto,
	"name" | "label" | "address" | "phone" | "email" | "businessNo" | "space"
>;

const DEFAULT_CONTENT_LANGUAGE_CODE: LanguageCode = "ko_KR";

/**
 * GroundForm이 사용하는 observable 상태 모델입니다.
 * API 응답 DTO에서 폼 필드만 가져오고, route는 이 class 인스턴스를 생성해 Screen에 주입합니다.
 */
export class GroundFormState
	implements
		Pick<
			GroundDto,
			"name" | "label" | "address" | "phone" | "email" | "businessNo"
		>,
		Required<Pick<UpdateGroundDto, "contentLanguageCode">>
{
	name = "";
	label = "";
	address = "";
	phone = "";
	email = "";
	businessNo = "";
	contentLanguageCode: LanguageCode = DEFAULT_CONTENT_LANGUAGE_CODE;
	errors: Partial<Record<GroundFormField, string>> = {};

	constructor(dto?: GroundFormResponseDto | null) {
		this.setFromDto(dto);
	}

	static fromDto(dto?: GroundFormResponseDto | null) {
		return new GroundFormState(dto);
	}

	setFromDto(dto?: GroundFormResponseDto | null) {
		if (!dto) {
			return this;
		}

		this.name = dto.name ?? "";
		this.label = dto.label ?? "";
		this.address = dto.address ?? "";
		this.phone = dto.phone ?? "";
		this.email = dto.email ?? "";
		this.businessNo = dto.businessNo ?? "";
		this.contentLanguageCode =
			dto.space?.contentLanguageCode ?? DEFAULT_CONTENT_LANGUAGE_CODE;
		this.errors = {};

		return this;
	}

	validate() {
		const errors: Partial<Record<GroundFormField, string>> = {};

		if (!this.name.trim()) {
			errors.name = "시설명을 입력해주세요.";
		}
		if (!this.address.trim()) {
			errors.address = "주소를 입력해주세요.";
		}
		if (!this.phone.trim()) {
			errors.phone = "전화번호를 입력해주세요.";
		}
		if (!this.email.trim()) {
			errors.email = "이메일을 입력해주세요.";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
			errors.email = "올바른 이메일 형식을 입력해주세요.";
		}
		if (!this.contentLanguageCode) {
			errors.contentLanguageCode = "콘텐츠 언어를 선택해주세요.";
		}

		this.errors = errors;
		return Object.keys(errors).length === 0;
	}

	toUpdateDto(): UpdateGroundDto {
		return {
			name: this.name.trim(),
			label: this.label.trim() || null,
			address: this.address.trim(),
			phone: this.phone.trim(),
			email: this.email.trim(),
			contentLanguageCode: this.contentLanguageCode,
		};
	}
}
