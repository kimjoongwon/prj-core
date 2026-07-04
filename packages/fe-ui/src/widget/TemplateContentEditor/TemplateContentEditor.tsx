"use client";

import { observer } from "mobx-react-lite";
import { TextArea } from "../../input/TextArea/TextArea";
import { TextField } from "../../input/TextField/TextField";
import { ByteCounter } from "../ByteCounter";
import { HtmlEditor } from "../HtmlEditor";

type TemplateType = "EMAIL" | "SMS" | "PUSH";

export interface TemplateContentEditorProps {
	/** 템플릿 유형 */
	type: TemplateType;
	/** 제목 값 */
	subject: string;
	/** 본문 값 */
	content: string;
	/** 제목 변경 핸들러 */
	onSubjectChange: (value: string) => void;
	/** 본문 변경 핸들러 */
	onContentChange: (value: string) => void;
	/** 에러 메시지 */
	errors?: {
		subject?: string;
		content?: string;
	};
	/** 읽기 전용 여부 */
	readOnly?: boolean;
}

/** PUSH 제목 최대 글자 수 */
const PUSH_SUBJECT_MAX_LENGTH = 50;

/** PUSH 본문 최대 글자 수 */
const PUSH_CONTENT_MAX_LENGTH = 200;

/**
 * TemplateContentEditor 컴포넌트
 * 등록/수정 폼에서 유형에 따라 동적으로 콘텐츠 입력 필드를 렌더링합니다.
 *
 * - EMAIL: 제목 TextField + HtmlEditor
 * - SMS: 본문 TextArea + ByteCounter (제목 숨김)
 * - PUSH: 제목 TextField (50자) + 본문 TextArea (200자) + 글자 수 표시
 *
 * @example
 * ```tsx
 * <TemplateContentEditor
 *   type="EMAIL"
 *   subject={subject}
 *   content={content}
 *   onSubjectChange={setSubject}
 *   onContentChange={setContent}
 *   errors={{ subject: "제목을 입력하세요" }}
 * />
 * ```
 */
export const TemplateContentEditor = observer(
	({
		type,
		subject,
		content,
		onSubjectChange,
		onContentChange,
		errors,
		readOnly = false,
	}: TemplateContentEditorProps) => {
		if (type === "EMAIL") {
			return (
				<EmailEditor
					subject={subject}
					content={content}
					onSubjectChange={onSubjectChange}
					onContentChange={onContentChange}
					errors={errors}
					readOnly={readOnly}
				/>
			);
		}

		if (type === "SMS") {
			return (
				<SmsEditor
					content={content}
					onContentChange={onContentChange}
					errors={errors}
					readOnly={readOnly}
				/>
			);
		}

		return (
			<PushEditor
				subject={subject}
				content={content}
				onSubjectChange={onSubjectChange}
				onContentChange={onContentChange}
				errors={errors}
				readOnly={readOnly}
			/>
		);
	},
);

TemplateContentEditor.displayName = "TemplateContentEditor";

/** EMAIL 유형 에디터 */
interface EmailEditorProps {
	subject: string;
	content: string;
	onSubjectChange: (value: string) => void;
	onContentChange: (value: string) => void;
	errors?: TemplateContentEditorProps["errors"];
	readOnly?: boolean;
}

const EmailEditor = observer(
	({
		subject,
		content,
		onSubjectChange,
		onContentChange,
		errors,
		readOnly = false,
	}: EmailEditorProps) => {
		return (
			<div className="flex flex-col gap-4">
				<TextField
					label="제목"
					isRequired
					value={subject}
					onValueChange={onSubjectChange}
					isInvalid={!!errors?.subject}
					errorMessage={errors?.subject}
					isReadOnly={readOnly}
					isDisabled={readOnly}
				/>
				<HtmlEditor
					value={content}
					onChange={onContentChange}
					isDisabled={readOnly}
				/>
			</div>
		);
	},
);

EmailEditor.displayName = "EmailEditor";

/** SMS 유형 에디터 */
interface SmsEditorProps {
	content: string;
	onContentChange: (value: string) => void;
	errors?: TemplateContentEditorProps["errors"];
	readOnly?: boolean;
}

const SmsEditor = observer(
	({ content, onContentChange, errors, readOnly = false }: SmsEditorProps) => {
		return (
			<div className="flex flex-col gap-4">
				<TextArea
					label="본문"
					isRequired
					value={content}
					onValueChange={onContentChange}
					minRows={5}
					isInvalid={!!errors?.content}
					errorMessage={errors?.content}
					isReadOnly={readOnly}
					isDisabled={readOnly}
				/>
				<ByteCounter text={content} />
			</div>
		);
	},
);

SmsEditor.displayName = "SmsEditor";

/** PUSH 유형 에디터 */
interface PushEditorProps {
	subject: string;
	content: string;
	onSubjectChange: (value: string) => void;
	onContentChange: (value: string) => void;
	errors?: TemplateContentEditorProps["errors"];
	readOnly?: boolean;
}

const PushEditor = observer(
	({
		subject,
		content,
		onSubjectChange,
		onContentChange,
		errors,
		readOnly = false,
	}: PushEditorProps) => {
		const isSubjectExceeded = subject.length > PUSH_SUBJECT_MAX_LENGTH;
		const isContentExceeded = content.length > PUSH_CONTENT_MAX_LENGTH;

		return (
			<div className="flex flex-col gap-4">
				<TextField
					label="제목"
					isRequired
					maxLength={PUSH_SUBJECT_MAX_LENGTH}
					value={subject}
					onValueChange={onSubjectChange}
					isInvalid={!!errors?.subject}
					errorMessage={errors?.subject}
					isReadOnly={readOnly}
					isDisabled={readOnly}
					description={
						<span className={isSubjectExceeded ? "text-danger" : ""}>
							{subject.length}/{PUSH_SUBJECT_MAX_LENGTH}자
						</span>
					}
				/>
				<TextArea
					label="본문"
					isRequired
					maxLength={PUSH_CONTENT_MAX_LENGTH}
					value={content}
					onValueChange={onContentChange}
					minRows={3}
					isInvalid={!!errors?.content}
					errorMessage={errors?.content}
					isReadOnly={readOnly}
					isDisabled={readOnly}
					description={
						<span className={isContentExceeded ? "text-danger" : ""}>
							{content.length}/{PUSH_CONTENT_MAX_LENGTH}자
						</span>
					}
				/>
			</div>
		);
	},
);

PushEditor.displayName = "PushEditor";
