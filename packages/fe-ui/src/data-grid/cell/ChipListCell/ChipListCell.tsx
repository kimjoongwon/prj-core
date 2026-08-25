"use client";

import { Chip } from "../../../data-display/Chip/Chip";
import { useT } from "../../../i18n";
import { DefaultCell } from "../DefaultCell/DefaultCell";

export interface ChipListCellProps {
	labels?: Array<string | number>;
}

/** 문자열 목록을 DataGrid Cell용 chip 목록으로 표시합니다. */
export function ChipListCell({ labels }: ChipListCellProps) {
	const t = useT();

	if (!labels?.length) {
		return <DefaultCell value={null} />;
	}

	return (
		<div className="flex flex-wrap gap-1">
			{labels.map((label) => (
				<Chip key={String(label)} size="sm" variant="flat">
					{typeof label === "string" ? t(label) : String(label)}
				</Chip>
			))}
		</div>
	);
}
