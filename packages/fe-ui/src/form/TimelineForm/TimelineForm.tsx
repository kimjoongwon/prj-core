"use client";

import { observer } from "mobx-react-lite";
import { Chip } from "../../data-display/Chip/Chip";
import {
	getContentLanguageLabel,
	toContentLanguageCode,
} from "../../data-display/content-language";
import { Alert } from "../../feedback/Alert/Alert";
import { TextArea } from "../../input/TextArea";
import { TextField } from "../../input/TextField";

export type TimelineFormField = "name" | "description";

export interface TimelineFormState {
	name: string;
	description: string;
	errors: Partial<Record<TimelineFormField, string>>;
}

export interface TimelineFormProps {
	state: TimelineFormState;
	contentLanguageCode?: string | null;
	readOnly?: boolean;
}

/**
 * Timeline aggregate의 편집 가능한 기본 필드 조합입니다.
 * create/edit/detail 여부는 route가 정하고, form은 readOnly만 기준으로 필드를 잠급니다.
 */
export const TimelineForm = observer(
	({ state, contentLanguageCode, readOnly = false }: TimelineFormProps) => {
		const languageCode = toContentLanguageCode(contentLanguageCode);
		const languageLabel = getContentLanguageLabel(contentLanguageCode);

		return (
			<div className="flex flex-col gap-4">
				<Alert
					status={languageCode ? "accent" : "warning"}
					title="현재 Space 콘텐츠 언어"
					actions={
						<Chip
							size="sm"
							variant="flat"
							color={languageCode ? "primary" : "warning"}
						>
							{languageLabel}
						</Chip>
					}
				/>
				<TextField
					label="타임라인명"
					placeholder="예: 2025년 가을 시즌, 10월 1주차"
					state={state}
					path="name"
					isReadOnly={readOnly}
					isDisabled={readOnly}
					isRequired
					isInvalid={Boolean(state.errors.name)}
					errorMessage={state.errors.name}
					onValueChange={() => {
						if (state.errors.name) {
							delete state.errors.name;
						}
					}}
				/>
				<TextArea
					label="설명"
					placeholder="타임라인에 대한 부가 설명을 입력하세요."
					state={state}
					path="description"
					isReadOnly={readOnly}
					isDisabled={readOnly}
					maxLength={500}
					description={`${state.description.length} / 500`}
					isInvalid={Boolean(state.errors.description)}
					errorMessage={state.errors.description}
					onValueChange={() => {
						if (state.errors.description) {
							delete state.errors.description;
						}
					}}
				/>
			</div>
		);
	},
);
