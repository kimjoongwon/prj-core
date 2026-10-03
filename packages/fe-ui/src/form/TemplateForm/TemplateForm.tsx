"use client";
import { observer } from "mobx-react-lite";
import { Typography } from "../../data-display/Typography";
import { RadioGroup } from "../../input/RadioGroup/RadioGroup";
import { TextArea } from "../../input/TextArea/TextArea";
import { TextField } from "../../input/TextField/TextField";
import { HStack, VStack } from "../../rhythm";
import { TemplateContentEditor } from "../TemplateContentEditor/TemplateContentEditor";
import {
	type VariableEditItem,
	VariableEditTable,
} from "../VariableEditTable/VariableEditTable";

/** 폼 데이터 인터페이스 */
export interface TemplateFormData {
	/** 템플릿 유형 */
	type: "EMAIL" | "SMS" | "PUSH";
	/** 템플릿 코드 (영문 대문자 + 언더스코어) */
	code: string;
	/** 템플릿 이름 */
	name: string;
	/** 설명 */
	description: string;
	/** 제목 */
	subject: string;
	/** 본문 */
	content: string;
}

export type TemplateFormField =
	| "type"
	| "code"
	| "name"
	| "description"
	| "subject"
	| "content"
	| "variables";

export interface TemplateFormState {
	formData: TemplateFormData;
	variables: VariableEditItem[];
	errors: Record<string, string>;
	variableErrors?: Record<number, Record<string, string>>;
}

export interface TemplateFormProps {
	state: TemplateFormState;
	readOnly?: boolean;
}

/** 코드 필드 유효성 검증 정규식 (영문 대문자 + 언더스코어) */
const CODE_PATTERN = /^[A-Z][A-Z0-9_]*$/;

/**
 * TemplateForm 컴포넌트
 * 메시지 템플릿 등록/수정 공용 폼입니다.
 * Store에 접근하지 않으며, route가 전달한 observable state만 수정합니다.
 *
 * 4개 섹션으로 구성됩니다:
 * 1. 기본 정보 - 유형, 코드, 이름, 설명
 * 2. 콘텐츠 - TemplateContentEditor(유형별 동적 렌더링)
 * 3. 변수 관리 - VariableEditTable (인라인 편집)
 * 4. route가 전달한 readOnly 기준으로 필드 잠금
 *
 * @example
 * ```tsx
 * <TemplateForm state={state} readOnly={false} />
 * ```
 */
export const TemplateForm = observer(
	({ state, readOnly = false }: TemplateFormProps) => {
		const { formData } = state;

		const updateFormData = (data: Partial<TemplateFormData>) => {
			Object.assign(state.formData, data);
			for (const key of Object.keys(data)) {
				delete state.errors[key];
			}
		};

		/** 제목 변경 핸들러 */
		const handleSubjectChange = (value: string) => {
			if (readOnly) {
				return;
			}
			updateFormData({ subject: value });
		};

		/** 본문 변경 핸들러 */
		const handleContentChange = (value: string) => {
			if (readOnly) {
				return;
			}
			updateFormData({ content: value });
		};

		return (
			<VStack>
				{/* 기본 정보 섹션 */}
				<section>
					<HStack alignItems="start" justifyContent="between" gap="block">
						<HStack alignItems="start" gap="inline">
							<div>
								<Typography.Heading level={5}>기본 정보</Typography.Heading>
							</div>
						</HStack>
					</HStack>
					<VStack gap="page">
						<RadioGroup
							label="유형"
							orientation="horizontal"
							value={formData.type}
							onValueChange={(value) => {
								if (readOnly) {
									return;
								}
								updateFormData({
									type: value as TemplateFormData["type"],
								});
							}}
							isRequired
							isDisabled={readOnly}
							isInvalid={!!state.errors.type}
							errorMessage={state.errors.type}
							options={[
								{ text: "이메일", value: "EMAIL" },
								{ text: "SMS", value: "SMS" },
								{ text: "푸시", value: "PUSH" },
							]}
						/>
						<TextField
							label="코드"
							placeholder="WELCOME_EMAIL"
							value={formData.code}
							onValueChange={(value) => {
								if (readOnly) {
									return;
								}
								updateFormData({ code: value });
							}}
							isRequired
							isInvalid={!!state.errors.code}
							errorMessage={state.errors.code}
							pattern={CODE_PATTERN.source}
							isReadOnly={readOnly}
							isDisabled={readOnly}
							description={
								!readOnly
									? "영문 대문자와 언더스코어(_)만 사용 가능합니다. 예: WELCOME_EMAIL"
									: "템플릿 코드는 수정할 수 없습니다."
							}
						/>
						<TextField
							label="이름"
							placeholder="템플릿 이름을 입력하세요"
							value={formData.name}
							onValueChange={(value) => {
								if (readOnly) {
									return;
								}
								updateFormData({ name: value });
							}}
							isRequired
							isInvalid={!!state.errors.name}
							errorMessage={state.errors.name}
							isReadOnly={readOnly}
							isDisabled={readOnly}
						/>
						<TextArea
							label="설명"
							placeholder="템플릿 용도를 설명해주세요"
							value={formData.description}
							onValueChange={(value) => {
								if (readOnly) {
									return;
								}
								updateFormData({ description: value });
							}}
							minRows={2}
							isInvalid={!!state.errors.description}
							errorMessage={state.errors.description}
							isReadOnly={readOnly}
							isDisabled={readOnly}
						/>
					</VStack>
				</section>
				{/* 콘텐츠 섹션 */}
				<section>
					<HStack alignItems="start" justifyContent="between" gap="block">
						<HStack alignItems="start" gap="inline">
							<div>
								<Typography.Heading level={5}>콘텐츠</Typography.Heading>
							</div>
						</HStack>
					</HStack>
					<TemplateContentEditor
						type={formData.type}
						subject={formData.subject}
						content={formData.content}
						onSubjectChange={handleSubjectChange}
						onContentChange={handleContentChange}
						errors={{
							subject: state.errors.subject,
							content: state.errors.content,
						}}
						readOnly={readOnly}
					/>
				</section>
				{/* 변수 관리 섹션 */}
				<section>
					<HStack alignItems="start" justifyContent="between" gap="block">
						<HStack alignItems="start" gap="inline">
							<div>
								<Typography.Heading level={5}>변수 관리</Typography.Heading>
							</div>
						</HStack>
					</HStack>
					<VariableEditTable
						variables={state.variables}
						onChange={(variables) => {
							if (readOnly) {
								return;
							}
							state.variables = variables;
						}}
						contentText={formData.content}
						errors={state.variableErrors}
						readOnly={readOnly}
					/>
				</section>
			</VStack>
		);
	},
);

TemplateForm.displayName = "TemplateForm";
