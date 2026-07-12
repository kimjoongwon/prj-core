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
			<span className="text-sm font-semibold text-foreground">
				미리보기 결과
			</span>
			<div className="rounded-lg border border-border bg-surface-secondary p-4">
				<div className="flex flex-col gap-2">
					{subject ? (
						<span className="text-sm font-semibold text-foreground">
							{subject}
						</span>
					) : null}
					<p className="whitespace-pre-wrap text-sm text-muted">{content}</p>
				</div>
			</div>
		</div>
	);
}
