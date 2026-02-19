# HistoryPanel Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/HistoryPanel/

## 역할

최근 항목 목록을 썸네일과 함께 표시하며, 선택/삭제/전체삭제 기능을 제공합니다. 제네릭 타입을 지원합니다.

## Props

```typescript
interface HistoryPanelProps<T extends HistoryItem = HistoryItem> {
  items: T[];
  selectedId?: string;
  onSelect: (item: T) => void;
  onDelete: (id: string) => void;
  onClearAll?: () => void;
  title?: string;            // 기본값: "최근 생성"
  emptyMessage?: string;     // 기본값: "이력이 없습니다"
  emptyIcon?: ReactNode;
  className?: string;
}

interface HistoryItem {
  id: string;
  title: string;
  createdAt: string;        // ISO string
  thumbnailUrl?: string;
  badge?: string;
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| HeroUI ScrollShadow | 스크롤 가능한 목록 영역 |
| HeroUI Image | 썸네일 이미지 |
| HeroUI Button | 전체 삭제/개별 삭제 |

## 상태 관리

**없음** (순수 UI)

## 슬롯

없음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
