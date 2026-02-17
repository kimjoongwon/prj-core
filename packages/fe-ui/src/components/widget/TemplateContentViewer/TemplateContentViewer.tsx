"use client";

import { observer } from "mobx-react-lite";
import { ByteCounter } from "../ByteCounter";
import { HtmlContentRenderer } from "../HtmlContentRenderer";

type TemplateType = "EMAIL" | "SMS" | "PUSH";

export interface TemplateContentViewerProps {
	/** 템플릿 유형 */
	type: TemplateType;
	/** 제목 (EMAIL, PUSH에서 사용) */
	subject: string | null;
	/** 본문 */
	content: string;
}

/** PUSH 제목 최대 글자 수 */
const PUSH_SUBJECT_MAX_LENGTH = 50;

/** PUSH 본문 최대 글자 수 */
const PUSH_CONTENT_MAX_LENGTH = 200;

/**
 * TemplateContentViewer 컴포넌트
 * 상세 화면에서 유형별 콘텐츠를 읽기 전용으로 표시합니다.
 *
 * - EMAIL: 제목 + HtmlContentRenderer
 * - SMS: 텍스트 본문 + ByteCounter
 * - PUSH: 제목 (글자 수 표시) + 본문 (글자 수 표시)
 *
 * @example
 * ```tsx
 * <TemplateContentViewer
 *   type="EMAIL"
 *   subject="가입을 환영합니다!"
 *   content="<h1>환영합니다</h1><p>가입해주셔서 감사합니다.</p>"
 * />
 * ```
 */
export const TemplateContentViewer = observer(
	({ type, subject, content }: TemplateContentViewerProps) => {
		if (type === "EMAIL") {
			return <EmailContent subject={subject} content={content} />;
		}

		if (type === "SMS") {
			return <SmsContent content={content} />;
		}

		return <PushContent subject={subject} content={content} />;
	},
);

TemplateContentViewer.displayName = "TemplateContentViewer";

/** EMAIL 유형 콘텐츠 */
interface EmailContentProps {
	subject: string | null;
	content: string;
}

const EmailContent = observer(({ subject, content }: EmailContentProps) => {
	return (
		<div className="flex flex-col gap-4">
			{subject !== null && (
				<div className="flex flex-col gap-1">
					<span className="text-sm text-default-500">제목</span>
					<span className="text-base">{subject}</span>
				</div>
			)}
			<div className="flex flex-col gap-1">
				<span className="text-sm text-default-500">본문</span>
				<HtmlContentRenderer html={content} />
			</div>
		</div>
	);
});

EmailContent.displayName = "EmailContent";

/** SMS 유형 콘텐츠 */
interface SmsContentProps {
	content: string;
}

const SmsContent = observer(({ content }: SmsContentProps) => {
	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-1">
				<span className="text-sm text-default-500">본문</span>
				<div className="whitespace-pre-wrap rounded-lg bg-content2 p-4 font-mono text-sm">
					{content}
				</div>
				<ByteCounter text={content} />
			</div>
		</div>
	);
});

SmsContent.displayName = "SmsContent";

/** PUSH 유형 콘텐츠 */
interface PushContentProps {
	subject: string | null;
	content: string;
}

const PushContent = observer(({ subject, content }: PushContentProps) => {
	const subjectLength = subject?.length ?? 0;
	const contentLength = content.length;

	return (
		<div className="flex flex-col gap-4">
			{subject !== null && (
				<div className="flex flex-col gap-1">
					<div className="flex items-center justify-between">
						<span className="text-sm text-default-500">제목</span>
						<span
							className={`text-xs ${subjectLength > PUSH_SUBJECT_MAX_LENGTH ? "text-danger" : "text-default-400"}`}
						>
							{subjectLength}/{PUSH_SUBJECT_MAX_LENGTH}자
						</span>
					</div>
					<div className="whitespace-pre-wrap rounded-lg bg-content2 p-4 font-mono text-sm">
						{subject}
					</div>
				</div>
			)}
			<div className="flex flex-col gap-1">
				<div className="flex items-center justify-between">
					<span className="text-sm text-default-500">본문</span>
					<span
						className={`text-xs ${contentLength > PUSH_CONTENT_MAX_LENGTH ? "text-danger" : "text-default-400"}`}
					>
						{contentLength}/{PUSH_CONTENT_MAX_LENGTH}자
					</span>
				</div>
				<div className="whitespace-pre-wrap rounded-lg bg-content2 p-4 font-mono text-sm">
					{content}
				</div>
			</div>
		</div>
	);
});

PushContent.displayName = "PushContent";
