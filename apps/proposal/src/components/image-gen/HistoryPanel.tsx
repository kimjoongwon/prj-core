"use client";

import { Button, Image, ScrollShadow } from "@heroui/react";
import { Clock, Trash2 } from "lucide-react";
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

function formatTime(isoString: string): string {
	const date = new Date(isoString);
	const now = new Date();
	const diff = now.getTime() - date.getTime();

	// 1시간 이내
	if (diff < 60 * 60 * 1000) {
		const minutes = Math.floor(diff / (60 * 1000));
		return minutes === 0 ? "방금" : `${minutes}분 전`;
	}

	// 오늘
	if (date.toDateString() === now.toDateString()) {
		return date.toLocaleTimeString("ko-KR", {
			hour: "2-digit",
			minute: "2-digit",
		});
	}

	// 어제
	const yesterday = new Date(now);
	yesterday.setDate(yesterday.getDate() - 1);
	if (date.toDateString() === yesterday.toDateString()) {
		return "어제";
	}

	// 그 외
	return date.toLocaleDateString("ko-KR", { month: "short", day: "numeric" });
}

export const HistoryPanel = observer(
	({
		items,
		selectedId,
		onSelect,
		onDelete,
		onClearAll,
	}: HistoryPanelProps) => {
		if (items.length === 0) {
			return (
				<div className="text-center py-8 text-default-400">
					<Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
					<p className="text-sm">이력이 없습니다</p>
				</div>
			);
		}

		return (
			<div className="flex flex-col h-full">
				<div className="flex items-center justify-between mb-3">
					<h3 className="text-sm font-semibold text-default-700">
						최근 생성 ({items.length})
					</h3>
					{onClearAll && items.length > 0 && (
						<Button
							size="sm"
							variant="light"
							color="danger"
							onPress={onClearAll}
						>
							전체 삭제
						</Button>
					)}
				</div>

				<ScrollShadow className="flex-1 -mx-2 px-2">
					<div className="space-y-2">
						{items.map((item) => {
							const isSelected = item.id === selectedId;
							const thumbnail = item.images[0];

							return (
								<button
									type="button"
									key={item.id}
									className={`
                  group relative flex gap-3 p-2 rounded-lg cursor-pointer transition-colors text-left w-full
                  ${isSelected ? "bg-primary/10 border border-primary/30" : "hover:bg-content2"}
                `}
									onClick={() => onSelect(item)}
								>
									{/* 썸네일 */}
									<div className="w-12 h-12 rounded-lg overflow-hidden bg-content2 flex-shrink-0">
										{thumbnail && (
											<Image
												src={getProxyImageUrl(thumbnail)}
												alt={item.prompt}
												className="w-full h-full object-cover"
												removeWrapper
											/>
										)}
									</div>

									{/* 정보 */}
									<div className="flex-1 min-w-0">
										<p className="text-sm truncate">{item.prompt}</p>
										<p className="text-xs text-default-400">
											{formatTime(item.createdAt)} · {item.images.length}장
										</p>
									</div>

									{/* 삭제 버튼 */}
									<Button
										isIconOnly
										size="sm"
										variant="light"
										color="danger"
										className="opacity-0 group-hover:opacity-100 transition-opacity"
										onPress={() => onDelete(item.id)}
										onClick={(e) => e.stopPropagation()}
										aria-label="삭제"
									>
										<Trash2 className="w-3 h-3" />
									</Button>
								</button>
							);
						})}
					</div>
				</ScrollShadow>
			</div>
		);
	},
);
