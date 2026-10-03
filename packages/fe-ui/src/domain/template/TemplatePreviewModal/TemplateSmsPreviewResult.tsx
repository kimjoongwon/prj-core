import { Typography } from "../../../data-display/Typography";
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
				<Typography.Paragraph size="sm" weight="semibold">
					미리보기 결과
				</Typography.Paragraph>
				<Typography.Paragraph color="muted" size="sm">
					{formatTextByteCount(content)}
				</Typography.Paragraph>
			</div>
			<div className="rounded-lg border border-border bg-surface-secondary p-4">
				<Typography.Paragraph className="whitespace-pre-wrap" size="sm">
					{content}
				</Typography.Paragraph>
			</div>
		</div>
	);
}
