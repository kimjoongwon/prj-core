"use client";

// @ts-ignore frappe-gantt does not provide TypeScript declarations
import Gantt from "frappe-gantt";
import { observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";

/** 스타일 타입 */
export type TimelineStyleType =
	| "completed"
	| "in-progress"
	| "pending"
	| "group";

/** 타임라인 아이템 인터페이스 */
export interface TimelineItem {
	/** 고유 ID */
	id: string;
	/** 표시 이름 */
	name: string;
	/** 시작일 (YYYY-MM-DD) */
	start: string;
	/** 종료일 (YYYY-MM-DD) */
	end: string;
	/** 진행률 (0-100) */
	progress: number;
	/** 의존성 ID 목록 */
	dependencies?: string[];
	/** 스타일 타입 */
	styleType?: TimelineStyleType;
}

/** frappe-gantt 내부 태스크 타입 */
export interface GanttTask {
	id: string;
	name: string;
	start: string;
	end: string;
	progress: number;
	dependencies?: string;
	custom_class?: string;
}

export interface TimelineChartProps<T extends TimelineItem = TimelineItem> {
	/** 타임라인 아이템 목록 */
	items: T[];
	/** 뷰 모드 */
	viewMode?: "Day" | "Week" | "Month" | "Year";
	/** 아이템 클릭 핸들러 */
	onItemClick?: (item: GanttTask) => void;
	/** 날짜 변경 핸들러 */
	onDateChange?: (item: GanttTask, start: Date, end: Date) => void;
	/** 진행률 변경 핸들러 */
	onProgressChange?: (item: GanttTask, progress: number) => void;
	/** 차트 높이 */
	height?: number;
	/** 추가 CSS 클래스 */
	className?: string;
}

/** ID를 CSS 셀렉터 호환 형식으로 변환 */
function sanitizeId(id: string): string {
	return id.replace(/\./g, "-");
}

/** 스타일 타입에 따른 CSS 클래스 반환 */
function getStyleClass(styleType?: TimelineStyleType): string {
	switch (styleType) {
		case "completed":
			return "gantt-completed";
		case "in-progress":
			return "gantt-in-progress";
		case "group":
			return "gantt-group";
		case "pending":
		default:
			return "gantt-pending";
	}
}

/** 타임라인 아이템을 frappe-gantt 형식으로 변환 */
function convertToGanttTasks(items: TimelineItem[]): GanttTask[] {
	return items.map((item) => ({
		id: sanitizeId(item.id),
		name: item.name,
		start: item.start,
		end: item.end,
		progress: item.progress,
		dependencies: item.dependencies?.map(sanitizeId).join(", ") || "",
		custom_class: getStyleClass(item.styleType),
	}));
}

/** 타임라인 차트 스타일 */
const TIMELINE_CHART_STYLES = `
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
`;

const STYLE_ID = "timeline-chart-styles";

/**
 * TimelineChart 컴포넌트
 * frappe-gantt 기반의 간트 차트를 시각화합니다.
 * 프로젝트 일정, 마일스톤 등을 타임라인으로 표시합니다.
 *
 * @example
 * ```tsx
 * <TimelineChart
 *   items={[
 *     { id: "1", name: "기획", start: "2024-01-01", end: "2024-01-15", progress: 100, styleType: "completed" },
 *     { id: "2", name: "개발", start: "2024-01-16", end: "2024-02-28", progress: 50, styleType: "in-progress" },
 *   ]}
 *   viewMode="Week"
 *   height={400}
 *   onItemClick={handleItemClick}
 * />
 * ```
 */
export const TimelineChart = observer(
	<T extends TimelineItem>({
		items,
		viewMode = "Week",
		onItemClick,
		onDateChange,
		onProgressChange,
		height = 400,
		className = "",
	}: TimelineChartProps<T>) => {
		const containerRef = useRef<HTMLDivElement>(null);
		const ganttRef = useRef<Gantt | null>(null);

		// 콜백 함수들을 ref로 관리하여 리렌더링 시 차트 재생성 방지
		const onItemClickRef = useRef(onItemClick);
		const onDateChangeRef = useRef(onDateChange);
		const onProgressChangeRef = useRef(onProgressChange);

		onItemClickRef.current = onItemClick;
		onDateChangeRef.current = onDateChange;
		onProgressChangeRef.current = onProgressChange;

		// 스타일 주입
		useEffect(() => {
			if (typeof document === "undefined") return;
			if (document.getElementById(STYLE_ID)) return;

			const styleElement = document.createElement("style");
			styleElement.id = STYLE_ID;
			styleElement.textContent = TIMELINE_CHART_STYLES;
			document.head.appendChild(styleElement);

			return () => {
				// 스타일은 전역으로 유지 (다른 인스턴스에서 사용할 수 있음)
			};
		}, []);

		// 아이템 데이터 키 (실제 데이터 변경 시에만 차트 재생성)
		const itemsKey = JSON.stringify(
			items.map((t) => ({
				id: t.id,
				start: t.start,
				end: t.end,
				progress: t.progress,
			})),
		);

		useEffect(() => {
			if (!containerRef.current || items.length === 0) return;

			containerRef.current.innerHTML = "";

			const ganttTasks = convertToGanttTasks(items);

			ganttRef.current = new Gantt(containerRef.current, ganttTasks, {
				view_mode: viewMode,
				date_format: "YYYY-MM-DD",
				language: "ko",
				popup: null,
				on_click: (task: GanttTask) => {
					onItemClickRef.current?.(task);
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
		}, [itemsKey]);

		// 뷰 모드 변경 시 업데이트
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
			</div>
		);
	},
);
