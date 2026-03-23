"use client";

import type { MetaDataGridConfig } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import { parseAsInteger, useQueryStates } from "@cocrepo/hook/nuqs";
import { Pagination } from "../../../../input/Pagination/Pagination";

interface MetaDataGridFooterProps<T> {
	config: MetaDataGridConfig<T>;
}

/**
 * MetaDataGrid 하단 영역 (Pagination)
 */
export const MetaDataGridFooter = observer(
	<T,>({ config }: MetaDataGridFooterProps<T>) => {
		// nuqs로 페이지네이션 상태 관리
		const [{ take, skip }, setQueryStates] = useQueryStates({
			take: parseAsInteger.withDefault(20),
			skip: parseAsInteger.withDefault(0),
		});

		// 현재 페이지 계산 (1부터 시작)
		const currentPage = Math.floor(skip / take) + 1;

		const handlePageChange = (page: number) => {
			const newSkip = (page - 1) * take;
			setQueryStates({ skip: newSkip });
		};

		return (
			<div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 py-4">
				<span className="text-sm text-default-500">
					총 {config.totalCount.toLocaleString()}건
				</span>
				<Pagination
					totalCount={config.totalCount}
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
