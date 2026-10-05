import { Typography } from "../../../data-display/Typography";

export interface TemplatePushPreviewResultProps {
	subject: string | null;
	content: string;
}

/** PUSH 템플릿 미리보기 결과를 렌더링합니다. */
export function TemplatePushPreviewResult({
	subject,
	content,
}: TemplatePushPreviewResultProps) {
	return (
		<div className="flex flex-col gap-3">
			<Typography.Paragraph size="sm" weight="semibold">
				미리보기 결과
			</Typography.Paragraph>
			<div className="rounded-lg border border-border bg-surface-secondary p-4">
				<div className="flex flex-col gap-2">
					{subject ? (
						<Typography.Paragraph size="sm" weight="semibold">
							{subject}
						</Typography.Paragraph>
					) : null}
					<Typography.Paragraph
						className="whitespace-pre-wrap"
						color="muted"
						size="sm"
					>
						{content}
					</Typography.Paragraph>
				</div>
			</div>
		</div>
	);
}
