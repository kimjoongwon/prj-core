"use client";

import type { DataGridColumnConfig, DataGridState } from "@cocrepo/type";
import { Popover } from "@heroui/react";
import { Settings2 } from "lucide-react";
import { useT } from "../../i18n";
import { Button } from "../../input/Button/Button";
import { Checkbox } from "../../input/Checkbox/Checkbox";

export interface DataGridColumnSettingsProps<T> {
	columns: DataGridColumnConfig<T>[];
	state: DataGridState;
}

function getColumnId<T>(column: DataGridColumnConfig<T>) {
	return String(column.field);
}

export function DataGridColumnSettingsView<T>({
	columns,
	state,
}: DataGridColumnSettingsProps<T>) {
	const t = useT();

	const handleVisibilityChange = (columnId: string, isVisible: boolean) => {
		if (state.columns.setColumnVisibility) {
			state.columns.setColumnVisibility(columnId, isVisible);
			return;
		}

		const nextVisibility = {
			...state.columns.visibility,
			[columnId]: isVisible,
		};
		state.columns.setVisibility?.(nextVisibility);
	};

	return (
		<Popover>
			<Popover.Trigger>
				<Button size="sm" variant="bordered" isIconOnly aria-label="컬럼 설정">
					<Settings2 className="size-4" />
				</Button>
			</Popover.Trigger>
			<Popover.Content placement="bottom end">
				<div className="flex min-w-56 flex-col gap-3 p-3">
					<div>
						<p className="text-sm font-semibold text-foreground">
							{t("컬럼 설정")}
						</p>
						<p className="text-xs text-muted">
							{t("표시할 컬럼을 선택합니다.")}
						</p>
					</div>
					<div className="flex flex-col gap-2">
						{columns.map((column) => {
							const columnId = getColumnId(column);
							const isRequired = column.isRequired === true;
							const isVisible =
								isRequired || state.columns.visibility[columnId] !== false;

							return (
								<Checkbox
									key={columnId}
									isSelected={isVisible}
									isDisabled={isRequired}
									onChange={(nextVisible) =>
										handleVisibilityChange(columnId, nextVisible)
									}
									classNames={{
										content: "text-sm font-medium",
									}}
								>
									{column.label}
								</Checkbox>
							);
						})}
					</div>
				</div>
			</Popover.Content>
		</Popover>
	);
}
