"use client";

import type { MetaDataGridConfig, MetaDataGridState } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import { InputRenderer } from "./InputRenderer";

interface MetaDataGridHeaderProps<T> {
	config: MetaDataGridConfig<T>;
	state: MetaDataGridState;
}

/**
 * MetaDataGrid 상단 영역
 * leftInputs: 검색, 필터 등
 * rightInputs: 버튼, 액션 등
 */
export const MetaDataGridHeader = observer(
	<T,>({ config, state }: MetaDataGridHeaderProps<T>) => {
		const leftInputs = (config.leftInputs ?? []).filter(
			(input) => input.props?.placement !== "column-header",
		);
		const rightInputs = (config.rightInputs ?? []).filter(
			(input) => input.props?.placement !== "column-header",
		);

		if (leftInputs.length === 0 && rightInputs.length === 0) {
			return null;
		}

		return (
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
				{/* 좌측 영역: 검색, 필터 */}
				<div className="flex flex-wrap items-center gap-2">
					{leftInputs.map((input) => (
						<InputRenderer
							key={input.id}
							config={input}
							state={state}
						/>
					))}
				</div>

				{/* 우측 영역: 버튼, 액션 */}
				<div className="flex items-center gap-2">
					{rightInputs.map((input) => (
						<InputRenderer
							key={input.id}
							config={input}
							state={state}
						/>
					))}
				</div>
			</div>
		);
	},
);
