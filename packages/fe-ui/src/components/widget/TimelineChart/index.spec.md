# TimelineChart Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/TimelineChart/

## 역할

frappe-gantt 기반의 간트 차트를 시각화합니다. 프로젝트 일정, 마일스톤을 타임라인으로 표시하며, HeroUI 테마와 통합된 스타일을 제공합니다.

## Props

```typescript
interface TimelineChartProps<T extends TimelineItem = TimelineItem> {
  items: T[];
  viewMode?: "Day" | "Week" | "Month" | "Year";  // 기본값: "Week"
  onItemClick?: (item: GanttTask) => void;
  onDateChange?: (item: GanttTask, start: Date, end: Date) => void;
  onProgressChange?: (item: GanttTask, progress: number) => void;
  height?: number;    // 기본값: 400
  className?: string;
}

interface TimelineItem {
  id: string;
  name: string;
  start: string;       // YYYY-MM-DD
  end: string;
  progress: number;    // 0-100
  dependencies?: string[];
  styleType?: "completed" | "in-progress" | "pending" | "group";
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| frappe-gantt (Gantt) | 간트 차트 라이브러리 |

## 상태 관리

로컬: containerRef, ganttRef (라이브러리 인스턴스), 전역 스타일 주입

## 슬롯

없음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
