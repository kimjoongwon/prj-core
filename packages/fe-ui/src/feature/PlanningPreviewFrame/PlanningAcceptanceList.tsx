import type { PlanningAcceptance } from "@cocrepo/type";

export interface PlanningAcceptanceListProps {
	items?: readonly PlanningAcceptance[];
}

export function PlanningAcceptanceList({ items }: PlanningAcceptanceListProps) {
	if (!items || items.length === 0) {
		return (
			<p className="rounded-md border border-dashed border-border px-3 py-2 text-sm text-muted">
				acceptance 항목 없음
			</p>
		);
	}

	return (
		<ul className="grid gap-2">
			{items.map((item) => (
				<li
					className="flex gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
					key={item.label}
				>
					<span aria-hidden className="font-semibold text-success">
						✓
					</span>
					<span className="min-w-0 flex-1 break-words">{item.label}</span>
					{item.required === false ? (
						<span className="text-xs text-muted">optional</span>
					) : null}
				</li>
			))}
		</ul>
	);
}
