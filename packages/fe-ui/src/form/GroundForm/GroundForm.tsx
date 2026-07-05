"use client";

import { observer } from "mobx-react-lite";
import { Select } from "../../input/Select";
import { TextField } from "../../input/TextField";
import { CONTENT_LANGUAGE_OPTIONS } from "../../data-display/content-language";
import type { GroundFormField, GroundFormState } from "./GroundForm.state";

export interface GroundFormProps {
	state: GroundFormState;
	readOnly?: boolean;
}

function clearFieldError(state: GroundFormState, field: GroundFormField) {
	if (state.errors[field]) {
		delete state.errors[field];
	}
}

/**
 * Ground aggregate의 시설 기본 정보 편집 필드 조합입니다.
 * create/edit/detail 여부는 route가 정하고, form은 readOnly만 기준으로 필드를 잠급니다.
 */
export const GroundForm = observer(
	({ state, readOnly = false }: GroundFormProps) => {
		return (
			<div className="flex flex-col gap-4">
				<TextField
					label="시설명"
					placeholder="시설명을 입력하세요"
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
					placeholder="단축 라벨을 입력하세요 (선택)"
					state={state}
					path="label"
					isReadOnly={readOnly}
					isDisabled={readOnly}
				/>
				<TextField
					label="주소"
					placeholder="주소를 입력하세요"
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
					label="전화번호"
					placeholder="전화번호를 입력하세요"
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
					label="이메일"
					placeholder="이메일을 입력하세요"
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
					label="사업자등록번호"
					state={state}
					path="businessNo"
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
