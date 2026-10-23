"use client";

import {
	createDataGridState,
	DataGrid,
	type DataGridState,
	type Key,
} from "@cocrepo/ui";
import { createColumnHelper } from "@tanstack/react-table";
import { runInAction } from "mobx";
import { useState } from "react";
import { GalleryExample, GallerySection } from "../GallerySection";

interface DesignServiceRow {
	id: Key;
	name: string;
	service: string;
	state: "운영 중" | "준비 중";
}

const column = createColumnHelper<DesignServiceRow>();

const designServiceColumns = [
	column.accessor("name", {
		header: "이름",
		enableSorting: true,
		meta: { label: "이름" },
	}),
	column.accessor("service", {
		header: "앱",
		enableSorting: true,
		meta: { label: "앱" },
	}),
	column.accessor("state", {
		header: "상태",
		enableSorting: true,
		meta: { label: "상태" },
	}),
];

const designServiceRows: DesignServiceRow[] = [
	{ id: "service-1", name: "디자인 링크 아카이브", service: "design-web", state: "운영 중" },
	{ id: "service-2", name: "라이브 커머스 시연", service: "live-web", state: "운영 중" },
	{ id: "service-3", name: "이력서 에이전트", service: "dolmen", state: "운영 중" },
	{ id: "service-4", name: "관리자 콘솔", service: "admin-web", state: "운영 중" },
	{ id: "service-5", name: "제안서 빌더", service: "proposal-web", state: "준비 중" },
	{ id: "service-6", name: "모바일 앱", service: "mobile-app", state: "준비 중" },
];

const DATA_GRID_SAMPLE_PAGE_SIZE = 5;

function createDesignServiceGridState() {
	let gridState: DataGridState<DesignServiceRow>;
	const setQueryStates = async (values: Record<string, unknown | null>) => {
		runInAction(() => {
			Object.assign(gridState.query.filters, values);
		});
		const searchKeyword = String(gridState.query.filters.search ?? "")
			.trim()
			.toLocaleLowerCase();
		const filteredRows = designServiceRows.filter(
			(row) =>
				!searchKeyword ||
				row.name.toLocaleLowerCase().includes(searchKeyword) ||
				row.service.toLocaleLowerCase().includes(searchKeyword),
		);
		const skip = gridState.query.pagination.skip;
		const take = gridState.query.pagination.take;
		runInAction(() => {
			gridState.pagination.totalCount = filteredRows.length;
			gridState.table.rows = filteredRows.slice(skip, skip + take);
		});
		return new URLSearchParams();
	};
	gridState = createDataGridState<DesignServiceRow>({
		query: { take: DATA_GRID_SAMPLE_PAGE_SIZE, skip: 0 },
		setQueryStates,
		pagination: { totalCount: designServiceRows.length },
		actionBar: { showCount: true },
		toolbar: {
			leftInputs: [
				{ type: "search", id: "search", placeholder: "이름 또는 앱 검색" },
			],
		},
		table: {
			rows: designServiceRows.slice(0, DATA_GRID_SAMPLE_PAGE_SIZE),
			columns: designServiceColumns,
			selection: { mode: "multiple" },
		},
	});
	return gridState;
}

export default function DataGridSection() {
	const [designServiceGridState] = useState(createDesignServiceGridState);

	return (
		<GallerySection
			id="data-grid"
			title="DataGrid"
			description="검색·정렬·행 선택·페이지 이동이 가능한 표 구성요소입니다."
		>
			<GalleryExample label="DataGrid" className="block">
				<DataGrid state={designServiceGridState} />
			</GalleryExample>
		</GallerySection>
	);
}
