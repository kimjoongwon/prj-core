"use client";

import type { MetaDataGridConfig, MetaDataGridState } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import { MetaDataGridActionBar } from "./MetaDataGridActionBar";
import { MetaDataGridBody } from "./MetaDataGridBody";
import { MetaDataGridEmpty } from "./MetaDataGridEmpty";
import { MetaDataGridFooter } from "./MetaDataGridFooter";
import { MetaDataGridHeader } from "./MetaDataGridHeader";
import { MetaDataGridSkeleton } from "./MetaDataGridSkeleton";

interface MetaDataGridProps<T> {
	config: MetaDataGridConfig<T>;
	state: MetaDataGridState;
	rows: T[];
	totalCount: number;
	isLoading?: boolean;
}

/**
 * MetaDataGrid 컴포넌트
 *
 * 메타데이터 기반 선언적 DataGrid 시스템
 * - 페이지 주입 query state 기반 페이지네이션/필터 제어
 * - 기존 DataGrid, Pagination 활용
 * - 선택 모드 지원 (none, single, multiple)
 *
 * @example
 * ```tsx
 * const gridConfig: MetaDataGridConfig<User> = {
 *   entity: "User",
 *   columns: [
 *     { field: "name", label: "이름", isRequired: true },
 *     { field: "email", label: "이메일" },
 *   ],
 *   leftInputs: [
 *     { type: "search", id: "search", placeholder: "검색" },
 *   ],
 *   rightInputs: [
 *     { type: "button", id: "create", label: "등록", props: { color: "primary" } },
 *   ],
 * };
 * const gridState = useLocalObservable(
 *   () => new MetaDataGridStateModel({ queryStates, setQueryStates }),
 * );
 *
 * <MetaDataGrid
 *   config={gridConfig}
 *   state={gridState}
 *   rows={users}
 *   totalCount={100}
 * />
 * ```
 */
export const MetaDataGrid = observer(
	<T extends { id: string | number }>({
		config,
		state,
		rows,
		totalCount,
		isLoading,
	}: MetaDataGridProps<T>) => {
		const { emptyMessage } = config;

		return (
			<>
				{/* 상단 영역: 검색, 필터, 버튼 */}
				<MetaDataGridHeader config={config} state={state} />

				{/* 본문 영역 */}
				{isLoading ? (
					<MetaDataGridSkeleton />
				) : rows.length === 0 ? (
					<MetaDataGridEmpty message={emptyMessage} />
				) : (
					<MetaDataGridBody
						config={config}
						state={state}
						rows={rows}
						isLoading={isLoading}
					/>
				)}

				{/* 하단 영역: 페이지네이션 */}
				<MetaDataGridFooter
					config={config}
					state={state}
					totalCount={totalCount}
				/>

				{/* 선택 시 액션바 */}
				<MetaDataGridActionBar config={config} state={state} />
			</>
		);
	},
);
