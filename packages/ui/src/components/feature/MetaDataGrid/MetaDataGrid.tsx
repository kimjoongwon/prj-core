"use client";

import type { MetaDataGridConfig } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import { MetaDataGridActionBar } from "./MetaDataGridActionBar";
import { MetaDataGridBody } from "./MetaDataGridBody";
import { MetaDataGridEmpty } from "./MetaDataGridEmpty";
import { MetaDataGridFooter } from "./MetaDataGridFooter";
import { MetaDataGridHeader } from "./MetaDataGridHeader";
import { MetaDataGridSkeleton } from "./MetaDataGridSkeleton";

interface MetaDataGridProps<T> {
	config: MetaDataGridConfig<T>;
}

/**
 * MetaDataGrid 컴포넌트
 *
 * 메타데이터 기반 선언적 DataGrid 시스템
 * - nuqs 연동: 페이지네이션, 필터가 URL querystring과 자동 동기화
 * - 기존 DataGrid, Pagination 활용
 * - 선택 모드 지원 (none, single, multiple)
 *
 * @example
 * ```tsx
 * const gridConfig: MetaDataGridConfig<User> = {
 *   entity: "User",
 *   data: users,
 *   totalCount: 100,
 *   queryStates,
 *   setQueryStates,
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
 *
 * <MetaDataGrid config={gridConfig} />
 * ```
 */
export const MetaDataGrid = observer(
	<T extends { id: string | number }>({ config }: MetaDataGridProps<T>) => {
		const { data, isLoading, emptyMessage } = config;

		return (
			<>
				{/* 상단 영역: 검색, 필터, 버튼 */}
				<MetaDataGridHeader config={config} />

				{/* 본문 영역 */}
				{isLoading ? (
					<MetaDataGridSkeleton />
				) : data.length === 0 ? (
					<MetaDataGridEmpty message={emptyMessage} />
				) : (
					<MetaDataGridBody config={config} />
				)}

				{/* 하단 영역: 페이지네이션 */}
				<MetaDataGridFooter config={config} />

				{/* 선택 시 액션바 */}
				<MetaDataGridActionBar config={config} />
			</>
		);
	},
);
