"use client";

import type { MetaDataGridConfig, MetaDataGridState } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import { Pagination } from "../../../control/Pagination/Pagination";

interface MetaDataGridFooterProps<T> {
	config: MetaDataGridConfig<T>;
	state: MetaDataGridState;
	totalCount: number;
}

/**
 * MetaDataGrid 하단 영역 (Pagination)
 */
export const MetaDataGridFooter = observer(
	<T,>({ state, totalCount }: MetaDataGridFooterProps<T>) => {
		const take =
			typeof state.query.values.take === "number" ? state.query.values.take : 20;
		const skip =
			typeof state.query.values.skip === "number" ? state.query.values.skip : 0;

		// 현재 페이지 계산 (1부터 시작)
		const currentPage = Math.floor(skip / Math.max(take, 1)) + 1;

		const handlePageChange = (page: number) => {
			const newSkip = (page - 1) * take;
			void state.query.setValues({ skip: newSkip });
		};

		return (
			<div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 py-4">
				<span className="text-sm text-default-500">
					총 {totalCount.toLocaleString()}건
				</span>
				<Pagination
					totalCount={totalCount}
					limit={take}
					page={currentPage}
					onChange={handlePageChange}
					showControls
					size="sm"
				/>
			</div>
		);
	},
);
