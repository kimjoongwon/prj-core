"use client";

import {
	HistoryPanel as GenericHistoryPanel,
	type HistoryItem,
} from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import type { ImageHistoryItem } from "@/lib/image-history";
import { getProxyImageUrl } from "@/lib/image-history";

interface HistoryPanelProps {
	items: ImageHistoryItem[];
	selectedId?: string;
	onSelect: (item: ImageHistoryItem) => void;
	onDelete: (id: string) => void;
	onClearAll?: () => void;
}

/**
 * 이미지 생성 히스토리 패널 (도메인 특화)
 * ImageHistoryItem 타입을 사용하여 ComfyUI 생성 이력 표시
 */
export const HistoryPanel = observer(
	({
		items,
		selectedId,
		onSelect,
		onDelete,
		onClearAll,
	}: HistoryPanelProps) => {
		// ImageHistoryItem을 HistoryItem으로 변환
		const convertedItems: (HistoryItem & { original: ImageHistoryItem })[] =
			items.map((item) => ({
				id: item.id,
				title: item.prompt,
				createdAt: item.createdAt,
				thumbnailUrl: item.images[0]
					? getProxyImageUrl(item.images[0])
					: undefined,
				badge: `${item.images.length}장`,
				original: item,
			}));

		return (
			<GenericHistoryPanel
				items={convertedItems}
				selectedId={selectedId}
				onSelect={(item) => onSelect(item.original)}
				onDelete={onDelete}
				onClearAll={onClearAll}
				title="최근 생성"
				emptyMessage="이력이 없습니다"
			/>
		);
	},
);
