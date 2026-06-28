import type { ReactNode } from "react";

export interface PlanningPreviewFieldProps {
	label: string;
	value?: ReactNode;
}

export function PlanningPreviewField({
	label,
	value,
}: PlanningPreviewFieldProps) {
	return (
		<div className="min-w-0 rounded-md border border-border bg-surface px-3 py-2">
			<p className="text-[11px] font-semibold uppercase text-muted">{label}</p>
			<p className="mt-1 break-words text-sm text-foreground">{value || "-"}</p>
		</div>
	);
}
