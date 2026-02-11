"use client";

import type { MetaDataGridConfig } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import { InputRenderer } from "./InputRenderer";

interface MetaDataGridActionBarProps<T> {
	config: MetaDataGridConfig<T>;
}

/**
 * 선택 시 표시되는 하단 액션바
 */
export const MetaDataGridActionBar = observer(
	<T,>({ config }: MetaDataGridActionBarProps<T>) => {
		const { selection } = config;

		if (!selection?.selectedKeys || selection.selectedKeys.size === 0) {
			return null;
		}

		const selectedCount = selection.selectedKeys.size;
		const actionBarConfig = selection.actionBar;

		return (
			<div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
				<div className="flex items-center gap-4 px-6 py-3 bg-content2 rounded-full shadow-lg border border-divider">
					{/* 선택된 항목 수 */}
					{actionBarConfig?.showCount !== false && (
						<span className="text-sm font-medium text-default-700">
							{selectedCount}개 선택됨
						</span>
					)}

					{/* 구분선 */}
					<div className="w-px h-6 bg-divider" />

					{/* 액션 버튼들 */}
					<div className="flex items-center gap-2">
						{actionBarConfig?.actions?.map((action) => (
							<InputRenderer key={action.id} config={action} />
						))}
					</div>
				</div>
			</div>
		);
	},
);
