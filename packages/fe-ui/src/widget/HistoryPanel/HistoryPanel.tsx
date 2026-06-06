"use client";

import { Clock, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";
import { Button } from "../../control/Button/Button";
import { ScrollShadow } from "@heroui/react";

export interface HistoryItem {
	/** 고유 식별자 */
	id: string;
	/** 제목/라벨 */
	title: string;
	/** 생성 시간 (ISO string) */
	createdAt: string;
	/** 썸네일 URL (옵션) */
	thumbnailUrl?: string;
	/** 부가 정보 (예: "3장") */
	badge?: string;
}

export interface HistoryPanelProps<T extends HistoryItem = HistoryItem> {
	/** 히스토리 아이템 목록 */
	items: T[];
	/** 선택된 아이템 ID */
	selectedId?: string;
	/** 아이템 선택 핸들러 */
	onSelect: (item: T) => void;
	/** 아이템 삭제 핸들러 */
	onDelete: (id: string) => void;
	/** 전체 삭제 핸들러 */
	onClearAll?: () => void;
	/** 패널 제목 (기본: "최근 생성") */
	title?: string;
	/** 빈 상태 메시지 */
	emptyMessage?: string;
	/** 빈 상태 아이콘 */
	emptyIcon?: ReactNode;
	/** 추가 클래스명 */
	className?: string;
}

/**
 * 시간 포맷팅 헬퍼 함수
 */
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

/**
 * HistoryPanel 컴포넌트
 * 최근 항목 목록을 썸네일과 함께 표시하며, 선택/삭제 기능을 제공합니다.
 *
 * @example
 * ```tsx
 * <HistoryPanel
 *   items={[
 *     { id: "1", title: "프롬프트 1", createdAt: "2024-01-01T12:00:00", thumbnailUrl: "/thumb.jpg" },
 *   ]}
 *   selectedId="1"
 *   onSelect={handleSelect}
 *   onDelete={handleDelete}
 *   onClearAll={handleClearAll}
 *   title="최근 생성"
 * />
 * ```
 */
export const HistoryPanel = observer(
	<T extends HistoryItem>({
		items,
		selectedId,
		onSelect,
		onDelete,
		onClearAll,
		title = "최근 생성",
		emptyMessage = "이력이 없습니다",
		emptyIcon,
		className,
	}: HistoryPanelProps<T>) => {
		if (items.length === 0) {
			return (
				<div className={`text-center py-8 text-muted ${className ?? ""}`}>
					{emptyIcon ?? <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />}
					<p className="text-sm">{emptyMessage}</p>
				</div>
			);
		}

		return (
			<div className={`flex flex-col h-full ${className ?? ""}`}>
				<div className="flex items-center justify-between mb-3">
					<h3 className="text-sm font-semibold text-foreground">
						{title} ({items.length})
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

							return (
								<button
									type="button"
									key={item.id}
									className={`
                    group relative flex gap-3 p-2 rounded-lg cursor-pointer transition-colors text-left w-full
                    ${isSelected ? "bg-accent/10 border border-accent/30" : "hover:bg-surface-secondary"}
                  `}
									onClick={() => onSelect(item)}
								>
									{/* 썸네일 */}
									<div className="w-12 h-12 rounded-lg overflow-hidden bg-surface-secondary flex-shrink-0">
										{item.thumbnailUrl && (
												<img
													src={item.thumbnailUrl}
													alt={item.title}
													className="w-full h-full object-cover"
												/>
										)}
									</div>

									{/* 정보 */}
									<div className="flex-1 min-w-0">
										<p className="text-sm truncate">{item.title}</p>
										<p className="text-xs text-muted">
											{formatTime(item.createdAt)}
											{item.badge && ` · ${item.badge}`}
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
