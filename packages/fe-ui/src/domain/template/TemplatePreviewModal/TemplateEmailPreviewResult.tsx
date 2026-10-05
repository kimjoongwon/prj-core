import { HtmlContentRenderer } from "../../../data-display/HtmlContentRenderer";
import { Typography } from "../../../data-display/Typography";

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
			<Typography.Paragraph size="sm" weight="semibold">
				미리보기 결과
			</Typography.Paragraph>
			{subject ? (
				<div className="flex flex-col">
					<Typography.Paragraph color="muted" size="xs">
						제목
					</Typography.Paragraph>
					<Typography.Paragraph size="sm">{subject}</Typography.Paragraph>
				</div>
			) : null}
			<div className="flex flex-col">
				<Typography.Paragraph color="muted" size="xs">
					본문
				</Typography.Paragraph>
				<HtmlContentRenderer html={content} />
			</div>
		</div>
	);
}
