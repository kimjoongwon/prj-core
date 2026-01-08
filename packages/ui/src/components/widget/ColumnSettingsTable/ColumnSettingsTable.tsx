import { arrayMove } from "@dnd-kit/sortable";
import { Card, CardBody, CardHeader, Checkbox, cn, Input } from "@heroui/react";
import { DeviceType } from "../../../registry/types";
import { DeviceToggleGroup } from "../../ui/data-display/DeviceToggleGroup";
import {
	DraggableSortableList,
	DragHandle,
} from "../../ui/data-display/DraggableSortableList";

/**
 * 컬럼 설정 데이터 타입
 */
export interface ColumnConfig {
	/** 고유 식별자 */
	id: string;
	/** 필드명 */
	field: string;
	/** 표시 라벨 */
	label: string;
	/** 표시 여부 */
	visible: boolean;
	/** 컬럼 너비 (px) */
	width: number;
	/** 정렬 순서 */
	sortOrder: number;
	/** 반응형 설정 */
	responsive: {
		desktop: boolean;
		tablet: boolean;
		mobile: boolean;
	};
}

/**
 * ColumnSettingsTable Props
 */
export interface ColumnSettingsTableProps {
	/** 엔티티 라벨 (헤더에 표시) */
	entityLabel: string;
	/** 컬럼 설정 목록 */
	columns: ColumnConfig[];
	/** 변경 시 콜백 */
	onChange: (columns: ColumnConfig[]) => void;
	/** 비활성화 여부 */
	disabled?: boolean;
}

/**
 * 테이블 컬럼 설정 위젯
 *
 * - 드래그 앤 드롭으로 순서 변경
 * - 표시 여부 토글
 * - 너비 입력
 * - 디바이스별 표시 설정
 */
export function ColumnSettingsTable({
	entityLabel,
	columns,
	onChange,
	disabled = false,
}: ColumnSettingsTableProps) {
	/**
	 * 순서 변경 핸들러
	 */
	const handleReorder = (fromIndex: number, toIndex: number) => {
		const reordered = arrayMove(columns, fromIndex, toIndex).map(
			(col, idx) => ({
				...col,
				sortOrder: idx + 1,
			}),
		);
		onChange(reordered);
	};

	/**
	 * 컬럼 업데이트 핸들러
	 */
	const handleUpdateColumn = (id: string, updates: Partial<ColumnConfig>) => {
		const updated = columns.map((col) =>
			col.id === id ? { ...col, ...updates } : col,
		);
		onChange(updated);
	};

	/**
	 * 디바이스 토글 핸들러
	 */
	const handleDeviceChange = (id: string, devices: DeviceType[]) => {
		handleUpdateColumn(id, {
			responsive: {
				desktop: devices.includes(DeviceType.DESKTOP),
				tablet: devices.includes(DeviceType.TABLET),
				mobile: devices.includes(DeviceType.MOBILE),
			},
		});
	};

	/**
	 * responsive 객체를 DeviceType[] 배열로 변환
	 */
	const getActiveDevices = (
		responsive: ColumnConfig["responsive"],
	): DeviceType[] => {
		const devices: DeviceType[] = [];
		if (responsive.desktop) devices.push(DeviceType.DESKTOP);
		if (responsive.tablet) devices.push(DeviceType.TABLET);
		if (responsive.mobile) devices.push(DeviceType.MOBILE);
		return devices;
	};

	return (
		<Card className="border-none shadow-sm">
			<CardHeader className="px-6 pb-0 pt-4">
				<span className="text-sm font-semibold text-default-700">{entityLabel} 테이블 컬럼 설정</span>
			</CardHeader>
			<CardBody className="px-6 py-4">
				{/* 헤더 행 */}
				<div className="mb-2 grid grid-cols-[40px_1fr_60px_100px_60px_120px] gap-2 border-b border-default-200 pb-2">
					<div />
					<span className="text-sm text-default-500 font-medium">
						컬럼명
					</span>
					<span className="text-sm text-default-500 text-center font-medium">
						표시
					</span>
					<span className="text-sm text-default-500 font-medium">
						너비
					</span>
					<span className="text-sm text-default-500 text-center font-medium">
						정렬
					</span>
					<span className="text-sm text-default-500 text-center font-medium">
						디바이스
					</span>
				</div>

				{/* 드래그 가능한 행 목록 */}
				<DraggableSortableList
					items={columns}
					onReorder={handleReorder}
					disabled={disabled}
					className="gap-0"
					renderItem={(column, _index, dragHandleProps) => (
						<div
							className={cn(
								"grid grid-cols-[40px_1fr_60px_100px_60px_120px] items-center gap-2 border-b border-default-100 py-2 last:border-0",
								dragHandleProps.isDragging && "bg-default-50",
							)}
						>
							{/* 드래그 핸들 */}
							<DragHandle
								attributes={dragHandleProps.attributes}
								listeners={dragHandleProps.listeners}
								disabled={disabled}
							/>

							{/* 컬럼명 */}
							<p className="text-sm font-medium">
								{column.label}
							</p>

							{/* 표시 체크박스 */}
							<div className="flex justify-center">
								<Checkbox
									isSelected={column.visible}
									onValueChange={(checked) =>
										handleUpdateColumn(column.id, { visible: checked })
									}
									isDisabled={disabled}
									size="sm"
									aria-label={`${column.label} 표시 여부`}
								/>
							</div>

							{/* 너비 입력 */}
							<Input
								type="number"
								value={String(column.width)}
								onValueChange={(value) =>
									handleUpdateColumn(column.id, {
										width: Number(value) || 0,
									})
								}
								isDisabled={disabled}
								size="sm"
								classNames={{
									input: "text-center",
									inputWrapper: "h-8",
								}}
								aria-label={`${column.label} 너비`}
							/>

							{/* 정렬 순서 */}
							<span className="text-sm text-default-500 text-center">
								{column.sortOrder}
							</span>

							{/* 디바이스 토글 */}
							<div className="flex justify-center">
								<DeviceToggleGroup
									value={getActiveDevices(column.responsive)}
									onChange={(devices) => handleDeviceChange(column.id, devices)}
									disabled={disabled}
									size="sm"
								/>
							</div>
						</div>
					)}
				/>
			</CardBody>
		</Card>
	);
}

ColumnSettingsTable.displayName = "ColumnSettingsTable";
