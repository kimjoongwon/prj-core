"use client";

import type { DataGridConfig, DataGridState } from "@cocrepo/type";
import { useT } from "../../i18n";
import { InputRenderer } from "../InputRenderer";
import type { Key } from "../internal/rowKeys";

type DataGridActionBarConfig<T extends { id: Key }> = NonNullable<
	DataGridConfig<T>["selection"]
>["actionBar"];

export interface DataGridActionBarProps<T extends { id: Key }> {
	actionBarConfig?: DataGridActionBarConfig<T>;
	selectedCount: number;
	state: DataGridState;
}

export function DataGridActionBarView<T extends { id: Key }>({
	actionBarConfig,
	selectedCount,
	state,
}: DataGridActionBarProps<T>) {
	const t = useT();

	if (selectedCount <= 0) {
		return null;
	}

	return (
		<div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
			<div className="flex items-center gap-4 px-6 py-3 bg-surface-secondary rounded-full shadow-lg border border-border">
				{actionBarConfig?.showCount !== false && (
					<span className="text-sm font-medium text-foreground">
						{selectedCount}
						{t("개 선택됨")}
					</span>
				)}
				<div className="w-px h-6 bg-border" />
				<div className="flex items-center gap-2">
					{actionBarConfig?.actions?.map((action) => (
						<InputRenderer key={action.id} config={action} state={state} />
					))}
				</div>
			</div>
		</div>
	);
}
