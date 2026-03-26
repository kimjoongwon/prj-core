"use client";

import { FileX } from "lucide-react";
import { observer } from "mobx-react-lite";

interface MetaDataGridEmptyProps {
	message?: string;
}

/**
 * MetaDataGrid 빈 상태
 */
export const MetaDataGridEmpty = observer(function MetaDataGridEmpty({
	message = "데이터가 없습니다.",
}: MetaDataGridEmptyProps) {
	return (
		<div className="flex flex-col items-center justify-center py-16 text-default-400">
			<FileX size={48} className="mb-4" />
			<p className="text-lg">{message}</p>
		</div>
	);
});
