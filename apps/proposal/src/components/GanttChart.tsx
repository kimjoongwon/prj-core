"use client";

import type { GanttTask, TimelineItem, TimelineStyleType } from "@cocrepo/ui";
import { TimelineChart } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";

import type { WbsTask } from "../app/api/wbs/route";

interface GanttChartProps {
	/** WBS 태스크 목록 */
	tasks: WbsTask[];
	/** 뷰 모드 (Day, Week, Month, Year) */
	viewMode?: "Day" | "Week" | "Month" | "Year";
	/** 태스크 클릭 핸들러 */
	onTaskClick?: (task: GanttTask) => void;
	/** 날짜 변경 핸들러 */
	onDateChange?: (task: GanttTask, start: Date, end: Date) => void;
	/** 진행률 변경 핸들러 */
	onProgressChange?: (task: GanttTask, progress: number) => void;
	/** 차트 높이 */
	height?: number;
	/** 추가 CSS 클래스 */
	className?: string;
}

/**
 * ID를 CSS 셀렉터 호환 형식으로 변환 (점을 하이픈으로)
 */
function sanitizeId(id: string): string {
	return id.replace(/\./g, "-");
}

/**
 * 진행률에 따른 스타일 타입 반환
 */
function getStyleType(progress: number, isGroup?: boolean): TimelineStyleType {
	if (isGroup) return "group";
	if (progress === 100) return "completed";
	if (progress > 0) return "in-progress";
	return "pending";
}

/**
 * WBS 태스크를 TimelineItem 형식으로 변환
 */
function convertToTimelineItems(tasks: WbsTask[]): TimelineItem[] {
	return tasks.map((task) => ({
		id: sanitizeId(task.id),
		name: task.name,
		start: task.start,
		end: task.end,
		progress: task.progress,
		dependencies: task.dependencies?.map(sanitizeId),
		styleType: getStyleType(task.progress, task.isGroup),
	}));
}

/**
 * 간트 차트 컴포넌트
 * WBS 태스크를 TimelineChart로 시각화
 */
export const GanttChartInner = observer(
	({
		tasks,
		viewMode = "Week",
		onTaskClick,
		onDateChange,
		onProgressChange,
		height = 400,
		className = "",
	}: GanttChartProps) => {
		const timelineItems = convertToTimelineItems(tasks);

		return (
			<TimelineChart
				items={timelineItems}
				viewMode={viewMode}
				onItemClick={onTaskClick}
				onDateChange={onDateChange}
				onProgressChange={onProgressChange}
				height={height}
				className={className}
			/>
		);
	},
);

export type { GanttChartProps, GanttTask };
