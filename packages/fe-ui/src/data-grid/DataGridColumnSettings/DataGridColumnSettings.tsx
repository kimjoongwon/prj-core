"use client";

import type { DataGridColumnSettingItem } from "@cocrepo/type";
import type { RowData, Table as TanStackTable } from "@tanstack/react-table";
import { Popover } from "@heroui/react";
import { Settings2 } from "lucide-react";
import { Typography } from "../../data-display/Typography";
import { useT } from "../../i18n";
import { Button } from "../../input/Button/Button";
import { Checkbox } from "../../input/Checkbox/Checkbox";

export interface DataGridColumnSettingsProps<TData extends RowData> {
	columns: DataGridColumnSettingItem[];
	table: TanStackTable<TData>;
}

export function DataGridColumnSettingsView<TData extends RowData>({
	columns,
	table,
}: DataGridColumnSettingsProps<TData>) {
	const t = useT();

	return (
		<Popover>
			<Popover.Trigger>
				<Button size="sm" variant="outline" isIconOnly aria-label="컬럼 설정">
					<Settings2 className="size-4" />
				</Button>
			</Popover.Trigger>
			<Popover.Content placement="bottom end">
				<div className="flex min-w-56 flex-col gap-3 p-3">
					<div>
						<Typography type="body-sm" weight="semibold">
							{t("컬럼 설정")}
						</Typography>
						<Typography color="muted" type="body-xs">
							{t("표시할 컬럼을 선택합니다.")}
						</Typography>
					</div>
					<div className="flex flex-col gap-2">
						{columns.map((column) => {
							const isRequired = column.isRequired === true;
							const tableColumn = table.getColumn(column.id);
							const isVisible =
								isRequired || tableColumn?.getIsVisible() !== false;

							return (
								<Checkbox
									key={column.id}
									isSelected={isVisible}
									isDisabled={isRequired || !tableColumn}
									onChange={(nextVisible) =>
										tableColumn?.toggleVisibility(nextVisible)
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
