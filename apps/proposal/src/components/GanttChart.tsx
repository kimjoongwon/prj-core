"use client";

import Gantt from "frappe-gantt";
import { observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";

import type { WbsTask } from "../app/api/wbs/route";

// frappe-gantt Task 타입
interface GanttTask {
	id: string;
	name: string;
	start: string;
	end: string;
	progress: number;
	dependencies?: string;
	custom_class?: string;
}

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
 * WBS 태스크를 frappe-gantt 형식으로 변환
 */
function convertToGanttTasks(tasks: WbsTask[]): GanttTask[] {
	return tasks.map((task) => ({
		id: sanitizeId(task.id),
		name: task.name,
		start: task.start,
		end: task.end,
		progress: task.progress,
		dependencies: task.dependencies?.map(sanitizeId).join(", ") || "",
		custom_class: task.isGroup
			? "gantt-group"
			: getProgressClass(task.progress),
	}));
}

/**
 * 진행률에 따른 CSS 클래스 반환
 */
function getProgressClass(progress: number): string {
	if (progress === 100) return "gantt-completed";
	if (progress > 0) return "gantt-in-progress";
	return "gantt-pending";
}

/**
 * 간트 차트 컴포넌트 (내부)
 * frappe-gantt 기반 WBS 시각화
 */
const GanttChartInner = observer(
	({
		tasks,
		viewMode = "Week",
		onTaskClick,
		onDateChange,
		onProgressChange,
		height = 400,
		className = "",
	}: GanttChartProps) => {
		const containerRef = useRef<HTMLDivElement>(null);
		const ganttRef = useRef<Gantt | null>(null);

		// 콜백 함수들을 ref로 관리하여 리렌더링 시 차트 재생성 방지
		const onTaskClickRef = useRef(onTaskClick);
		const onDateChangeRef = useRef(onDateChange);
		const onProgressChangeRef = useRef(onProgressChange);

		// ref 업데이트
		onTaskClickRef.current = onTaskClick;
		onDateChangeRef.current = onDateChange;
		onProgressChangeRef.current = onProgressChange;

		// 태스크 데이터 키 (실제 데이터 변경 시에만 차트 재생성)
		const tasksKey = JSON.stringify(
			tasks.map((t) => ({
				id: t.id,
				start: t.start,
				end: t.end,
				progress: t.progress,
			})),
		);

		useEffect(() => {
			if (!containerRef.current || tasks.length === 0) return;

			// 기존 차트 제거
			containerRef.current.innerHTML = "";

			const ganttTasks = convertToGanttTasks(tasks);

			// 간트 차트 생성
			ganttRef.current = new Gantt(containerRef.current, ganttTasks, {
				view_mode: viewMode,
				date_format: "YYYY-MM-DD",
				language: "ko",
				popup: null,
				on_click: (task: GanttTask) => {
					onTaskClickRef.current?.(task);
				},
				on_date_change: (task: GanttTask, start: Date, end: Date) => {
					onDateChangeRef.current?.(task, start, end);
				},
				on_progress_change: (task: GanttTask, progress: number) => {
					onProgressChangeRef.current?.(task, progress);
				},
			});

			return () => {
				if (containerRef.current) {
					containerRef.current.innerHTML = "";
				}
			};
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [tasksKey]);

		// 뷰 모드 변경 시 업데이트 (차트 재생성 없이)
		useEffect(() => {
			if (ganttRef.current) {
				ganttRef.current.change_view_mode(viewMode);
			}
		}, [viewMode]);

		return (
			<div className={className}>
				<div
					ref={containerRef}
					style={{ height: `${height}px`, overflow: "auto" }}
					className="gantt-container"
				/>
				<style jsx global>{`
					/* frappe-gantt base styles */
					.gantt-container {
						line-height: 14.5px;
						position: relative;
						overflow: auto;
						font-size: 12px;
						height: var(--gv-grid-height);
						width: 100%;
						border-radius: 8px;
					}

					.gantt-container .popup-wrapper {
						position: absolute;
						top: 0;
						left: 0;
						background: #fff;
						box-shadow: 0 10px 24px -3px #0003;
						padding: 10px;
						border-radius: 5px;
						width: max-content;
						z-index: 1000;
					}

					.gantt-container .popup-wrapper .title {
						margin-bottom: 2px;
						color: var(--g-text-dark);
						font-size: 0.85rem;
						font-weight: 650;
						line-height: 15px;
					}

					.gantt-container .popup-wrapper .subtitle {
						color: var(--g-text-dark);
						font-size: 0.8rem;
						margin-bottom: 5px;
					}

					.gantt-container .popup-wrapper .details {
						color: var(--g-text-muted);
						font-size: 0.7rem;
					}

					.gantt-container .grid-header {
						height: calc(var(--gv-lower-header-height) + var(--gv-upper-header-height) + 10px);
						background-color: hsl(var(--heroui-content2));
						position: sticky;
						top: 0;
						left: 0;
						border-bottom: 1px solid hsl(var(--heroui-divider));
						z-index: 1000;
					}

					.gantt-container .lower-text,
					.gantt-container .upper-text {
						text-anchor: middle;
					}

					.gantt-container .upper-header {
						height: var(--gv-upper-header-height);
					}

					.gantt-container .lower-header {
						height: var(--gv-lower-header-height);
					}

					.gantt-container .lower-text {
						font-size: 12px;
						position: absolute;
						width: calc(var(--gv-column-width) * 0.8);
						height: calc(var(--gv-lower-header-height) * 0.8);
						margin: 0 calc(var(--gv-column-width) * 0.1);
						align-content: center;
						text-align: center;
						color: hsl(var(--heroui-default-500));
					}

					.gantt-container .upper-text {
						position: absolute;
						width: fit-content;
						font-weight: 500;
						font-size: 14px;
						color: hsl(var(--heroui-foreground));
						height: calc(var(--gv-lower-header-height) * 0.66);
					}

					.gantt-container .current-upper {
						position: sticky;
						left: 0 !important;
						padding-left: 17px;
						background: hsl(var(--heroui-content2));
					}

					.gantt-container .side-header {
						position: sticky;
						top: 0;
						right: 0;
						float: right;
						z-index: 1000;
						line-height: 20px;
						font-weight: 400;
						width: max-content;
						margin-left: auto;
						padding-right: 10px;
						padding-top: 10px;
						background: hsl(var(--heroui-content2));
						display: flex;
					}

					.gantt-container .current-highlight {
						position: absolute;
						background: var(--g-today-highlight);
						width: 1px;
						z-index: 999;
					}

					.gantt-container .current-ball-highlight {
						position: absolute;
						background: var(--g-today-highlight);
						z-index: 1001;
						border-radius: 50%;
					}

					.gantt-container .hide {
						display: none;
					}

					.gantt {
						user-select: none;
						-webkit-user-select: none;
						position: absolute;
					}

					.gantt .grid-background {
						fill: none;
					}

					.gantt .grid-row {
						fill: var(--g-row-color);
					}

					.gantt .row-line {
						stroke: var(--g-border-color);
					}

					.gantt .tick {
						stroke: var(--g-tick-color);
						stroke-width: 0.4;
					}

					.gantt .tick.thick {
						stroke: var(--g-tick-color-thick);
						stroke-width: 0.7;
					}

					.gantt .arrow {
						fill: none;
						stroke: var(--g-arrow-color);
						stroke-width: 1.5;
					}

					.gantt .bar-wrapper .bar {
						fill: var(--g-bar-color);
						stroke: var(--g-bar-border);
						stroke-width: 0;
						transition: stroke-width 0.3s ease;
					}

					.gantt .bar-progress {
						fill: var(--g-progress-color);
						border-radius: 4px;
					}

					.gantt .bar-expected-progress {
						fill: var(--g-expected-progress);
					}

					.gantt .bar-invalid {
						fill: transparent;
						stroke: var(--g-bar-border);
						stroke-width: 1;
						stroke-dasharray: 5;
					}

					.gantt .bar-label {
						fill: var(--g-text-dark);
						dominant-baseline: central;
						font-family: Helvetica;
						font-size: 13px;
						font-weight: 400;
					}

					.gantt .bar-label.big {
						fill: var(--g-text-dark);
						text-anchor: start;
					}

					.gantt .handle {
						fill: var(--g-handle-color);
						opacity: 0;
						transition: opacity 0.3s ease;
					}

					.gantt .handle.active,
					.gantt .handle.visible {
						cursor: ew-resize;
						opacity: 1;
					}

					.gantt .handle.progress {
						fill: var(--g-text-muted);
					}

					.gantt .bar-wrapper {
						cursor: pointer;
					}

					.gantt .bar-wrapper:hover .bar {
						transition: transform 0.3s ease;
					}

					/* HeroUI theme overrides */
					.gantt-container {
						background: hsl(var(--heroui-content1));
						border-radius: 12px;
					}

					.gantt-container .gantt .bar-wrapper .bar {
						fill: hsl(var(--heroui-primary));
						stroke: hsl(var(--heroui-primary));
					}

					.gantt-container .gantt .bar-wrapper .bar-progress {
						fill: hsl(var(--heroui-primary));
					}

					.gantt-container .gantt .bar-wrapper.gantt-completed .bar {
						fill: hsl(var(--heroui-success));
						stroke: hsl(var(--heroui-success));
					}

					.gantt-container .gantt .bar-wrapper.gantt-completed .bar-progress {
						fill: hsl(var(--heroui-success));
					}

					.gantt-container .gantt .bar-wrapper.gantt-in-progress .bar {
						fill: hsl(var(--heroui-warning));
						stroke: hsl(var(--heroui-warning));
					}

					.gantt-container .gantt .bar-wrapper.gantt-in-progress .bar-progress {
						fill: hsl(var(--heroui-warning));
					}

					.gantt-container .gantt .bar-wrapper.gantt-pending .bar {
						fill: hsl(var(--heroui-default-300));
						stroke: hsl(var(--heroui-default-400));
					}

					.gantt-container .gantt .bar-wrapper.gantt-group .bar {
						fill: hsl(var(--heroui-secondary));
						stroke: hsl(var(--heroui-secondary));
						rx: 4;
					}

					.gantt-container .gantt .bar-label {
						fill: hsl(var(--heroui-foreground));
						font-size: 12px;
					}

					.gantt-container .gantt .grid-header {
						fill: hsl(var(--heroui-content2));
					}

					.gantt-container .gantt .grid-row {
						fill: hsl(var(--heroui-content1));
					}

					.gantt-container .gantt .grid-row:nth-child(even) {
						fill: hsl(var(--heroui-content2) / 0.5);
					}

					.gantt-container .gantt .row-line,
					.gantt-container .gantt .tick {
						stroke: hsl(var(--heroui-divider));
					}

					.gantt-container .gantt .today-highlight {
						fill: hsl(var(--heroui-primary) / 0.1);
					}

					.gantt-container .gantt .lower-text,
					.gantt-container .gantt .upper-text {
						fill: hsl(var(--heroui-default-600));
						font-size: 11px;
					}

					.gantt-container .gantt .arrow {
						stroke: hsl(var(--heroui-default-400));
						stroke-width: 1.5;
					}

					.gantt-container .gantt .handle {
						fill: hsl(var(--heroui-primary));
						cursor: ew-resize;
					}
				`}</style>
			</div>
		);
	},
);

export { GanttChartInner };
export type { GanttChartProps, GanttTask };
