import { formatTextByteCount } from "../../../data-display/text-byte";

export interface TemplateSmsPreviewResultProps {
	content: string;
}

/** SMS 템플릿 미리보기 결과를 렌더링합니다. */
export function TemplateSmsPreviewResult({
	content,
}: TemplateSmsPreviewResultProps) {
	return (
		<div className="flex flex-col">
			<div className="flex">
				<span className="text-sm font-semibold text-foreground">
					미리보기 결과
				</span>
				<span className="text-sm text-muted">
					{formatTextByteCount(content)}
				</span>
			</div>
			<div className="rounded-lg border border-border bg-surface-secondary p-4">
				<p className="whitespace-pre-wrap text-sm text-foreground">{content}</p>
			</div>
		</div>
	);
}
