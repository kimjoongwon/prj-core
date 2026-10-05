"use client";

import type {
	DataGridColumnConfig,
	DataGridColumnsStateSnapshot,
} from "@cocrepo/type";
import { Popover } from "@heroui/react";
import { Settings2 } from "lucide-react";
import { Typography } from "../../data-display/Typography";
import { useT } from "../../i18n";
import { Button } from "../../input/Button/Button";
import { Checkbox } from "../../input/Checkbox/Checkbox";

export interface DataGridColumnSettingsProps<T> {
	columns: DataGridColumnConfig<T>[];
	columnState: DataGridColumnsStateSnapshot;
	onColumnChange: (columns: DataGridColumnsStateSnapshot) => void;
}

function getColumnId<T>(column: DataGridColumnConfig<T>) {
	return String(column.field);
}

export function DataGridColumnSettingsView<T>({
	columns,
	columnState,
	onColumnChange,
}: DataGridColumnSettingsProps<T>) {
	const t = useT();

	const handleVisibilityChange = (columnId: string, isVisible: boolean) => {
		const nextVisibility = {
			...columnState.visibility,
			[columnId]: isVisible,
		};
		onColumnChange({ ...columnState, visibility: nextVisibility });
	};

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
							const columnId = getColumnId(column);
							const isRequired = column.isRequired === true;
							const isVisible =
								isRequired || columnState.visibility[columnId] !== false;

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
