import { HtmlContentRenderer } from "../../../data-display/HtmlContentRenderer";

export interface TemplateEmailPreviewResultProps {
	subject: string | null;
	content: string;
}

/** EMAIL 템플릿 미리보기 결과를 렌더링합니다. */
export function TemplateEmailPreviewResult({
	subject,
	content,
}: TemplateEmailPreviewResultProps) {
	return (
		<div className="flex flex-col">
			<span className="text-sm font-semibold text-foreground">
				미리보기 결과
			</span>
			{subject ? (
				<div className="flex flex-col">
					<span className="text-xs text-muted">제목</span>
					<span className="text-sm text-foreground">{subject}</span>
				</div>
			) : null}
			<div className="flex flex-col">
				<span className="text-xs text-muted">본문</span>
				<HtmlContentRenderer html={content} />
			</div>
		</div>
	);
}
