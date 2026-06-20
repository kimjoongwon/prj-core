"use client";
import { observer } from "mobx-react-lite";
import { Button } from "../../action/Button/Button";
import { Input } from "../../input/Input/Input";
import { TextArea } from "../../input/TextArea/TextArea";
import { RadioGroup } from "../../selection/RadioGroup/RadioGroup";
import { TemplateContentEditor } from "../../widget/TemplateContentEditor/TemplateContentEditor";
import { TemplateTypeBadge } from "../../widget/TemplateTypeBadge/TemplateTypeBadge";
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

export interface TemplateFormProps {
	/** 등록/수정 모드 */
	mode: "create" | "edit";
	/** 기본 정보 */
	formData: TemplateFormData;
	/** 변수 목록 */
	variables: VariableEditItem[];
	/** 폼 데이터 변경 핸들러 */
	onFormDataChange: (data: Partial<TemplateFormData>) => void;
	/** 변수 변경 핸들러 */
	onVariablesChange: (variables: VariableEditItem[]) => void;
	/** 제출 핸들러 */
	onSubmit: () => void;
	/** 취소 핸들러 */
	onCancel: () => void;
	/** 제출 중 여부 */
	isSubmitting: boolean;
	/** 필드별 에러 */
	errors?: Record<string, string>;
	/** 변수별 에러 */
	variableErrors?: Record<number, Record<string, string>>;
}

/** 코드 필드 유효성 검증 정규식 (영문 대문자 + 언더스코어) */
const CODE_PATTERN = /^[A-Z][A-Z0-9_]*$/;

/**
 * TemplateForm 컴포넌트
 * 메시지 템플릿 등록/수정 공용 폼입니다.
 * Store에 접근하지 않으며, 모든 데이터와 핸들러를 props로 전달받습니다.
 *
 * 4개 섹션으로 구성됩니다:
 * 1. 기본 정보 - 유형, 코드, 이름, 설명
 * 2. 콘텐츠 - TemplateContentEditor (유형별 동적 렌더링)
 * 3. 변수 관리 - VariableEditTable (인라인 편집)
 * 4. 버튼 영역 - 취소, 등록/저장
 *
 * @example
 * ```tsx
 * <TemplateForm
 *   mode="create"
 *   formData={formData}
 *   variables={variables}
 *   onFormDataChange={handleFormDataChange}
 *   onVariablesChange={handleVariablesChange}
 *   onSubmit={handleSubmit}
 *   onCancel={handleCancel}
 *   isSubmitting={false}
 *   errors={{ name: "이름을 입력하세요" }}
 * />
 * ```
 */
export const TemplateForm = observer(
	({
		mode,
		formData,
		variables,
		onFormDataChange,
		onVariablesChange,
		onSubmit,
		onCancel,
		isSubmitting,
		errors,
		variableErrors,
	}: TemplateFormProps) => {
		const isEdit = mode === "edit";

		/** 제목 변경 핸들러 */
		const handleSubjectChange = (value: string) => {
			onFormDataChange({ subject: value });
		};

		/** 본문 변경 핸들러 */
		const handleContentChange = (value: string) => {
			onFormDataChange({ content: value });
		};

		return (
			<div className="flex flex-col gap-4">
				{/* 기본 정보 섹션 */}
				<section>
					<div className="flex items-start justify-between gap-3">
						<div className="flex items-start gap-2">
							<div>
								<h2>{"기본 정보"}</h2>
							</div>
						</div>
					</div>
					<div className="space-y-6">
						{isEdit ? (
							<div className="flex flex-col gap-1.5">
								<span className="text-sm text-muted">유형</span>
								<TemplateTypeBadge type={formData.type} />
							</div>
						) : (
							<RadioGroup
								label="유형"
								orientation="horizontal"
								value={formData.type}
								onValueChange={(value) =>
									onFormDataChange({
										type: value as TemplateFormData["type"],
									})
								}
								isRequired
								isInvalid={!!errors?.type}
								errorMessage={errors?.type}
								options={[
									{ text: "이메일", value: "EMAIL" },
									{ text: "SMS", value: "SMS" },
									{ text: "푸시", value: "PUSH" },
								]}
							/>
						)}
						{isEdit ? (
							<div className="flex flex-col gap-1.5">
								<span className="text-sm text-muted">코드</span>
								<p className="text-foreground">{formData.code}</p>
							</div>
						) : (
							<Input
								label="코드"
								placeholder="WELCOME_EMAIL"
								value={formData.code}
								onValueChange={(value) =>
									onFormDataChange({
										code: value,
									})
								}
								isRequired
								isInvalid={!!errors?.code}
								errorMessage={errors?.code}
								pattern={CODE_PATTERN.source}
								description="영문 대문자와 언더스코어(_)만 사용 가능합니다. 예: WELCOME_EMAIL"
							/>
						)}
						<Input
							label="이름"
							placeholder="템플릿 이름을 입력하세요"
							value={formData.name}
							onValueChange={(value) =>
								onFormDataChange({
									name: value,
								})
							}
							isRequired
							isInvalid={!!errors?.name}
							errorMessage={errors?.name}
						/>
						<TextArea
							label="설명"
							placeholder="템플릿 용도를 설명해주세요"
							value={formData.description}
							onValueChange={(value) =>
								onFormDataChange({
									description: value,
								})
							}
							minRows={2}
							isInvalid={!!errors?.description}
							errorMessage={errors?.description}
						/>
					</div>
				</section>
				{/* 콘텐츠 섹션 */}
				<section>
					<div className="flex items-start justify-between gap-3">
						<div className="flex items-start gap-2">
							<div>
								<h2>{"콘텐츠"}</h2>
							</div>
						</div>
					</div>
					<TemplateContentEditor
						type={formData.type}
						subject={formData.subject}
						content={formData.content}
						onSubjectChange={handleSubjectChange}
						onContentChange={handleContentChange}
						errors={{
							subject: errors?.subject,
							content: errors?.content,
						}}
					/>
				</section>
				{/* 변수 관리 섹션 */}
				<section>
					<div className="flex items-start justify-between gap-3">
						<div className="flex items-start gap-2">
							<div>
								<h2>{"변수 관리"}</h2>
							</div>
						</div>
					</div>
					<VariableEditTable
						variables={variables}
						onChange={onVariablesChange}
						contentText={formData.content}
						errors={variableErrors}
					/>
				</section>
				{/* 버튼 영역 */}
				<div className="mt-4 flex justify-end gap-2">
					<Button variant="flat" onPress={onCancel} isDisabled={isSubmitting}>
						취소
					</Button>
					<Button color="primary" onPress={onSubmit}>
						{isEdit ? "저장" : "등록"}
					</Button>
				</div>
			</div>
		);
	},
);

TemplateForm.displayName = "TemplateForm";
