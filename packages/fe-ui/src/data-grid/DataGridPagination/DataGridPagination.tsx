"use client";

import type { DataGridSetQueryStates } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import { useT } from "../../i18n";
import { Pagination } from "../../input/Pagination/Pagination";
import type { DataGridQueryState } from "../DataGrid";
import { useHandlers } from "./useHandlers";

/** 페이지 전체 건수와 공유 query 데이터입니다. */
export interface DataGridPaginationState {
	totalCount: number;
	query: DataGridQueryState;
	querySetter: DataGridSetQueryStates;
}
export interface DataGridPaginationProps {
	state: DataGridPaginationState;
}

/** 전체 건수와 페이지 이동 컨트롤을 표시합니다. */
export const DataGridPagination = observer(
	({ state }: DataGridPaginationProps) => {
		const t = useT();
		const handlers = useHandlers(state);
		return (
			<Pagination
				className="flex-col sm:flex-row justify-between items-center gap-4 mt-4 py-4"
				size="sm"
			>
				<Pagination.Summary className="text-sm text-muted">
					{t("총")} {state.totalCount.toLocaleString()}
					{t("건")}
				</Pagination.Summary>
				<Pagination.Content>
					<Pagination.Item>
						<Pagination.Previous
							isDisabled={handlers.isPreviousDisabled}
							onPress={handlers.previousPage}
						>
							<Pagination.PreviousIcon />
							<span>Previous</span>
						</Pagination.Previous>
					</Pagination.Item>
					{handlers.pageItems.map((item) =>
						item.kind === "ellipsis" ? (
							<Pagination.Item key={item.key}>
								<Pagination.Ellipsis />
							</Pagination.Item>
						) : (
							<Pagination.Item key={item.page}>
								<Pagination.Link
									isActive={item.page === handlers.page}
									onPress={handlers.pageHandler(item.page)}
								>
									{item.page}
								</Pagination.Link>
							</Pagination.Item>
						),
					)}
					<Pagination.Item>
						<Pagination.Next
							isDisabled={handlers.isNextDisabled}
							onPress={handlers.nextPage}
						>
							<span>Next</span>
							<Pagination.NextIcon />
						</Pagination.Next>
					</Pagination.Item>
				</Pagination.Content>
			</Pagination>
		);
	},
);
