# TimelineChart Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/widget/TimelineChart/

## 역할

frappe-gantt 기반의 간트 차트를 시각화합니다. 프로젝트 일정, 마일스톤을 타임라인으로 표시하며, HeroUI 테마와 통합된 스타일을 제공합니다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
[Week 뷰 (기본)]
┌──────────────────────────────────────────────────────────────┐
│        2월 3주             2월 4주             3월 1주        │
│  Mon Tue Wed Thu Fri │ Mon Tue Wed Thu Fri │ Mon Tue Wed     │
├────────────────────────────────────────────────────────────── │
│ 기획 단계    ████████████░░░░░░░░░░░░░░░░░░                  │
│ 디자인       ░░░░░░░░░████████████░░░░░░░░                    │
│  └ 와이어프레임       ░░░░████████░░░░░░░░                    │
│ 개발                  ░░░░░░░░░░░███████████████              │
│  └ 백엔드             ░░░░░░░░░░░██████░░░░░░░                │
│  └ 프론트엔드         ░░░░░░░░░░░░░░░███████░░                │
│ 테스트                ░░░░░░░░░░░░░░░░░░░███████             │
└──────────────────────────────────────────────────────────────┘

범례: ████ 완료   ░░░░ 진행중   .... 예정

[Month 뷰 (viewMode=Month)]
┌──────────────────────────────────────────────────────────────┐
│              2월                         3월                  │
│  1주  2주  3주  4주  │  1주  2주  3주  4주                   │
├───────────────────────────────────────────────────────────── │
│ Sprint 1  █████████████░░░░░░░░░░░░░░░░░░░░░                 │
│ Sprint 2  ░░░░░░░░░░░░░█████████████░░░░░░░                  │
└──────────────────────────────────────────────────────────────┘

[styleType별 막대 색상]
  completed   : ████ (초록, 100%)
  in-progress : ████ (파랑, 진행률 표시)
  pending     : ░░░░ (회색, 0%)
  group       : ████ (진한 색, 상위 그룹)
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| Day 뷰 | 시간 단위 세부 표시 |
| Week 뷰 (기본) | 주 단위, 요일 헤더 |
| Month 뷰 | 월 단위, 주차 헤더 |
| Year 뷰 | 연 단위, 월 헤더 |
| completed | 초록색 막대 |
| in-progress | 파란색 막대 + 진행률 |
| pending | 회색 막대 |
| group | 진한 색 막대 (상위 그룹) |

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
| 2026-03-06 | 폴더 네이밍을 단수형(feature/input/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
| 2026-03-06 | widget 디렉토리를 widgets로 통합하며 위치 경로를 정리 | codex |
