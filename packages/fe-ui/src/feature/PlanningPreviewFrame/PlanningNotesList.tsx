export interface PlanningNotesListProps {
	items?: readonly string[];
}

export function PlanningNotesList({ items }: PlanningNotesListProps) {
	if (!items || items.length === 0) {
		return (
			<p className="rounded-md border border-dashed border-border px-3 py-2 text-sm text-muted">
				notes 항목 없음
			</p>
		);
	}

	return (
		<ul className="grid gap-2">
			{items.map((item) => (
				<li
					className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
					key={item}
				>
					{item}
				</li>
			))}
		</ul>
	);
}
