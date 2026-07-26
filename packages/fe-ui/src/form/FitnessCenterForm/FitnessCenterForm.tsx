"use client";

import { observer } from "mobx-react-lite";
import { CONTENT_LANGUAGE_OPTIONS } from "../../data-display/content-language";
import { Select } from "../../input/Select";
import { TextField } from "../../input/TextField";
import type {
	FitnessCenterFormField,
	FitnessCenterFormState,
} from "./FitnessCenterForm.state";

export interface FitnessCenterFormProps {
	state: FitnessCenterFormState;
	readOnly?: boolean;
}

export interface FitnessCenterCreateCompanyFieldsProps {
	state: FitnessCenterFormState;
	readOnly?: boolean;
}

function clearFieldError(
	state: FitnessCenterFormState,
	field: FitnessCenterFormField,
) {
	if (state.errors[field]) {
		delete state.errors[field];
	}
}

/**
 * FitnessCenter의 기본 정보 편집 필드 조합입니다.
 * create/edit/detail 여부는 route가 정하고, form은 readOnly만 기준으로 필드를 잠급니다.
 */
export const FitnessCenterForm = observer(
	({ state, readOnly = false }: FitnessCenterFormProps) => {
		return (
			<div className="flex flex-col gap-4">
				<TextField
					label="센터명"
					placeholder="센터명을 입력하세요"
					state={state}
					path="name"
					isReadOnly={readOnly}
					isDisabled={readOnly}
					isRequired
					isInvalid={Boolean(state.errors.name)}
					errorMessage={state.errors.name}
					onValueChange={() => clearFieldError(state, "name")}
				/>
				<TextField
					label="라벨"
					placeholder="센터 라벨을 입력하세요 (선택)"
					state={state}
					path="label"
					isReadOnly={readOnly}
					isDisabled={readOnly}
				/>
				<TextField
					label="센터 주소"
					placeholder="센터 주소를 입력하세요"
					state={state}
					path="address"
					isReadOnly={readOnly}
					isDisabled={readOnly}
					isRequired
					isInvalid={Boolean(state.errors.address)}
					errorMessage={state.errors.address}
					onValueChange={() => clearFieldError(state, "address")}
				/>
				<TextField
					label="대표 전화번호"
					placeholder="대표 전화번호를 입력하세요"
					type="tel"
					state={state}
					path="phone"
					isReadOnly={readOnly}
					isDisabled={readOnly}
					isRequired
					isInvalid={Boolean(state.errors.phone)}
					errorMessage={state.errors.phone}
					onValueChange={() => clearFieldError(state, "phone")}
				/>
				<TextField
					label="대표 이메일"
					placeholder="대표 이메일을 입력하세요"
					type="email"
					state={state}
					path="email"
					isReadOnly={readOnly}
					isDisabled={readOnly}
					isRequired
					isInvalid={Boolean(state.errors.email)}
					errorMessage={state.errors.email}
					onValueChange={() => clearFieldError(state, "email")}
				/>
				<TextField
					label="센터 이미지"
					placeholder="이미지 파일 ID를 입력하세요 (선택)"
					state={state}
					path="imageFileId"
					isReadOnly={readOnly}
					isDisabled={readOnly}
				/>
				<Select
					label="콘텐츠 언어"
					placeholder="운영 리소스 작성 언어를 선택하세요"
					state={state}
					path="contentLanguageCode"
					options={CONTENT_LANGUAGE_OPTIONS.map((language) => ({
						value: language.code,
						label: language.label,
					}))}
					isDisabled={readOnly}
					isRequired
					isInvalid={Boolean(state.errors.contentLanguageCode)}
					errorMessage={state.errors.contentLanguageCode}
					onValueChange={() => clearFieldError(state, "contentLanguageCode")}
				/>
			</div>
		);
	},
);

/**
 * Space 생성에서만 사용하는 Company 전환 필드입니다.
 * FitnessCenter edit 폼에서는 직접 렌더링하지 않고 create route가 명시적으로 조합합니다.
 */
export const FitnessCenterCreateCompanyFields = observer(
	({ state, readOnly = false }: FitnessCenterCreateCompanyFieldsProps) => {
		return (
			<div className="flex flex-col gap-4">
				<TextField
					label="사업자등록번호"
					placeholder="사업자등록번호를 입력하세요"
					state={state}
					path="businessNo"
					isReadOnly={readOnly}
					isDisabled={readOnly}
					isInvalid={Boolean(state.errors.businessNo)}
					errorMessage={state.errors.businessNo}
					onValueChange={() => clearFieldError(state, "businessNo")}
				/>
				<TextField
					label="회사 로고"
					placeholder="로고 이미지 파일 ID를 입력하세요 (선택)"
					state={state}
					path="logoImageFileId"
					isReadOnly={readOnly}
					isDisabled={readOnly}
					isInvalid={Boolean(state.errors.logoImageFileId)}
					errorMessage={state.errors.logoImageFileId}
					onValueChange={() => clearFieldError(state, "logoImageFileId")}
				/>
			</div>
		);
	},
);
