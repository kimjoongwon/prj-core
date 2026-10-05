import type { LanguageCode } from "@cocrepo/api/core/model";

interface FitnessCenterFormValueShape {
	name?: string | null;
	label?: string | null;
	address?: string | null;
	phone?: string | null;
	email?: string | null;
	imageFileId?: string | null;
}

interface FitnessCenterUpdatePayload {
	name: string;
	label: string | null;
	address: string;
	phone: string;
	email: string;
	imageFileId: string | null;
	contentLanguageCode: LanguageCode;
}

export type FitnessCenterFormField =
	| "name"
	| "label"
	| "address"
	| "phone"
	| "email"
	| "imageFileId"
	| "contentLanguageCode"
	| "businessNo"
	| "logoImageFileId";

export type FitnessCenterFormResponseDto = FitnessCenterFormValueShape & {
	businessNo?: string | null;
	logoImageFileId?: string | null;
	space?: {
		contentLanguageCode?: LanguageCode | null;
		[key: string]: unknown;
	} | null;
	[key: string]: unknown;
};

const DEFAULT_CONTENT_LANGUAGE_CODE: LanguageCode = "ko_KR";

/**
 * FitnessCenterForm이 사용하는 observable 상태 모델입니다.
 * API 응답 DTO에서 폼 필드만 가져오고, route는 이 class 인스턴스를 생성해 Screen에 주입합니다.
 */
export class FitnessCenterFormState
	implements FitnessCenterUpdatePayload, Required<FitnessCenterFormValueShape>
{
	name = "";
	label = "";
	address = "";
	phone = "";
	email = "";
	imageFileId = "";
	businessNo = "";
	logoImageFileId = "";
	contentLanguageCode: LanguageCode = DEFAULT_CONTENT_LANGUAGE_CODE;
	errors: Partial<Record<FitnessCenterFormField, string>> = {};

	constructor(dto?: FitnessCenterFormResponseDto | null) {
		this.setFromDto(dto);
	}

	static fromDto(dto?: FitnessCenterFormResponseDto | null) {
		return new FitnessCenterFormState(dto);
	}

	setFromDto(dto?: FitnessCenterFormResponseDto | null) {
		if (!dto) {
			return this;
		}

		this.name = dto.name ?? "";
		this.label = dto.label ?? "";
		this.address = dto.address ?? "";
		this.phone = dto.phone ?? "";
		this.email = dto.email ?? "";
		this.imageFileId = dto.imageFileId ?? "";
		this.businessNo = "";
		this.logoImageFileId = "";
		this.contentLanguageCode =
			dto.space?.contentLanguageCode ?? DEFAULT_CONTENT_LANGUAGE_CODE;
		this.errors = {};

		return this;
	}

	validate() {
		const errors: Partial<Record<FitnessCenterFormField, string>> = {};

		if (!this.name.trim()) {
			errors.name = "센터명을 입력해주세요.";
		}
		if (!this.address.trim()) {
			errors.address = "센터 주소를 입력해주세요.";
		}
		if (!this.phone.trim()) {
			errors.phone = "대표 전화번호를 입력해주세요.";
		}
		if (!this.email.trim()) {
			errors.email = "대표 이메일을 입력해주세요.";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
			errors.email = "올바른 이메일 형식을 입력해주세요.";
		}
		if (!this.contentLanguageCode) {
			errors.contentLanguageCode = "콘텐츠 언어를 선택해주세요.";
		}

		this.errors = errors;
		return Object.keys(errors).length === 0;
	}

	toUpdateDto(): FitnessCenterUpdatePayload {
		return {
			name: this.name.trim(),
			label: this.label.trim() || null,
			address: this.address.trim(),
			phone: this.phone.trim(),
			email: this.email.trim(),
			imageFileId: this.imageFileId.trim() || null,
			contentLanguageCode: this.contentLanguageCode,
		};
	}
}
