"use client";

import type { SortDescriptor } from "@heroui/react";
import { Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { Key } from "react";
import { AssetKindBadge } from "../../ui/data-display/AssetKindBadge";
import type { AssetStatus } from "../../ui/data-display/AssetStatusBadge";
import { AssetStatusBadge } from "../../ui/data-display/AssetStatusBadge";
import { AssetThumbnail } from "../../ui/data-display/AssetThumbnail/AssetThumbnail";
import { SelectionCheckbox } from "../../ui/data-display/SelectionCheckbox/SelectionCheckbox";
import { SizeDisplay } from "../../ui/data-display/SizeDisplay/SizeDisplay";
import { VStack } from "../../ui/surfaces/VStack/VStack";

/**
 * AssetList용 에셋 타입
 */
export interface AssetListItem {
	id: string;
	originalName: string;
	kind: "IMAGE" | "VIDEO" | "DOCUMENT";
	status: AssetStatus;
	sizeBytes: number;
	mimeType: string;
	thumbnailUrl?: string | null;
	folderId: string;
	folderPath?: string;
	createdAt: string | Date;
}

/**
 * 컬럼 정의
 */
export interface AssetListColumn {
	key: string;
	label: string;
	width?: number;
	sortable?: boolean;
	render?: (asset: AssetListItem) => React.ReactNode;
}

export interface AssetListProps {
	/** 에셋 목록 */
	assets: AssetListItem[];
	/** 선택된 ID 목록 */
	selectedIds?: Set<string>;
	/** 현재 정렬 키 */
	sortKey?: string;
	/** 정렬 순서 */
	sortOrder?: "asc" | "desc";
	/** 선택 가능 여부 */
	selectable?: boolean;
	/** 표시할 컬럼 구성 */
	columns?: AssetListColumn[];
	/** 선택 핸들러 */
	onSelect?: (assetId: string) => void;
	/** 전체 선택 핸들러 */
	onSelectAll?: (assetIds: string[]) => void;
	/** 정렬 핸들러 */
	onSort?: (key: string, order: "asc" | "desc") => void;
	/** 행 클릭 핸들러 */
	onRowClick?: (asset: AssetListItem) => void;
	/** 더 보기 핸들러 */
	onLoadMore?: () => void;
	/** 더 불러올 데이터 존재 여부 */
	hasMore?: boolean;
	/** 로딩 상태 */
	isLoading?: boolean;
	/** 빈 상태 메시지 */
	emptyMessage?: string;
	/** 추가 클래스명 */
	className?: string;
}

/** 기본 컬럼 구성 */
const DEFAULT_COLUMNS: AssetListColumn[] = [
	{ key: "thumbnail", label: "미리보기", width: 60 },
	{ key: "originalName", label: "파일명", sortable: true },
	{ key: "kind", label: "타입", width: 80, sortable: true },
	{ key: "sizeBytes", label: "크기", width: 100, sortable: true },
	{ key: "status", label: "상태", width: 80, sortable: true },
	{ key: "folderPath", label: "폴더", width: 120 },
	{ key: "createdAt", label: "등록일", width: 120, sortable: true },
];

/**
 * 날짜 포맷팅
 */
const formatDate = (date: string | Date): string => {
	const d = typeof date === "string" ? new Date(date) : date;
	return d.toLocaleDateString("ko-KR", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});
};

/**
 * AssetList Widget 컴포넌트
 *
 * 에셋 목록을 테이블 형태로 표시하는 순수 UI 컴포넌트입니다.
 * 정렬, 선택 기능을 지원합니다.
 *
 * **이 컴포넌트는 Store에 접근하지 않습니다.**
 * 모든 데이터와 핸들러는 props로 전달받습니다.
 *
 * @example
 * ```tsx
 * <AssetList
 *   assets={assets}
 *   selectedIds={selectedIds}
 *   selectable
 *   onSelect={handleSelect}
 *   onSort={handleSort}
 *   onRowClick={handleRowClick}
 * />
 * ```
 */
export const AssetList = observer(
	({
		assets,
		selectedIds = new Set(),
		sortKey,
		sortOrder,
		selectable = true,
		columns = DEFAULT_COLUMNS,
		onSelect,
		onSelectAll,
		onSort,
		onRowClick,
		isLoading,
		emptyMessage = "표시할 에셋이 없습니다",
		className,
	}: AssetListProps) => {
		const allSelected = assets.length > 0 && assets.every((a) => selectedIds.has(a.id));
		const someSelected = assets.some((a) => selectedIds.has(a.id));

		const handleSelectAll = (checked: boolean) => {
			if (onSelectAll) {
				if (checked) {
					onSelectAll(assets.map((a) => a.id));
				} else {
					onSelectAll([]);
				}
			}
		};

		const handleSelect = (assetId: string) => {
			onSelect?.(assetId);
		};

		const handleSortColumn = (key: Key) => {
			const column = columns.find((c) => c.key === key);
			if (column?.sortable && onSort) {
				const newOrder = sortKey === key && sortOrder === "asc" ? "desc" : "asc";
				onSort(key as string, newOrder);
			}
		};

		const handleRowClick = (asset: AssetListItem) => {
			onRowClick?.(asset);
		};

		/** 컬럼 렌더링 */
		const renderCell = (asset: AssetListItem, columnKey: Key) => {
			switch (columnKey) {
				case "thumbnail":
					return (
						<AssetThumbnail
							src={asset.thumbnailUrl}
							alt={asset.originalName}
							kind={asset.kind}
							size="md"
						/>
					);
				case "originalName":
					return (
						<span className="truncate max-w-[200px]" title={asset.originalName}>
							{asset.originalName}
						</span>
					);
				case "kind":
					return <AssetKindBadge kind={asset.kind} />;
				case "sizeBytes":
					return <SizeDisplay bytes={asset.sizeBytes} />;
				case "status":
					return <AssetStatusBadge status={asset.status} />;
				case "folderPath":
					return (
						<span className="text-default-500 text-sm truncate max-w-[100px]" title={asset.folderPath}>
							{asset.folderPath ?? "/"}
						</span>
					);
				case "createdAt":
					return <span className="text-default-500 text-sm">{formatDate(asset.createdAt)}</span>;
				default:
					const column = columns.find((c) => c.key === columnKey);
					return column?.render ? column.render(asset) : null;
			}
		};

		/** 로딩 상태 */
		if (isLoading) {
			return (
				<VStack alignItems="center" justifyContent="center" className="h-64" gap={4}>
					<Spinner size="lg" />
					<span className="text-default-500">로딩 중...</span>
				</VStack>
			);
		}

		/** 빈 상태 */
		if (assets.length === 0) {
			return (
				<VStack alignItems="center" justifyContent="center" className="h-64" gap={2}>
					<span className="text-default-400">{emptyMessage}</span>
				</VStack>
			);
		}

		const tableColumns = selectable
			? [{ key: "select", label: "", width: 40 }, ...columns]
			: columns;

		// sortDescriptor 생성
		const sortDescriptor: SortDescriptor | undefined = sortKey
			? {
					column: sortKey as string | number,
					direction: sortOrder === "desc" ? "descending" : "ascending",
			  }
			: undefined;

		return (
			<div className={className}>
				<Table
					aria-label="에셋 목록"
					selectionMode={selectable ? "multiple" : "none"}
					selectedKeys={selectedIds}
					onSelectionChange={(keys) => {
						if (keys === "all") {
							handleSelectAll(true);
						} else {
							const ids = Array.from(keys) as string[];
							onSelectAll?.(ids);
						}
					}}
					onRowAction={(key) => {
						const asset = assets.find((a) => a.id === key);
						if (asset) handleRowClick(asset);
					}}
					sortDescriptor={sortDescriptor}
					onSortChange={(descriptor) => {
						if (descriptor.column) {
							handleSortColumn(descriptor.column);
						}
					}}
					classNames={{
						wrapper: "p-0",
						th: "bg-content1",
					}}
				>
					<TableHeader columns={tableColumns}>
						{(column) => (
							<TableColumn
								key={column.key}
								allowsSorting={column.sortable}
								width={column.width}
							>
								{column.key === "select" ? (
									<SelectionCheckbox
										checked={allSelected}
										indeterminate={someSelected && !allSelected}
										onChange={handleSelectAll}
									/>
								) : (
									column.label
								)}
							</TableColumn>
						)}
					</TableHeader>
					<TableBody items={assets}>
						{(asset) => (
							<TableRow key={asset.id}>
								{(columnKey) => (
									<TableCell>
										{columnKey === "select" ? (
											<SelectionCheckbox
												checked={selectedIds.has(asset.id)}
												onChange={() => handleSelect(asset.id)}
											/>
										) : (
											renderCell(asset, columnKey)
										)}
									</TableCell>
								)}
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		);
	},
);

AssetList.displayName = "AssetList";
