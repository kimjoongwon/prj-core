# HistoryPanel Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/widget/HistoryPanel/

## 역할

최근 항목 목록을 썸네일과 함께 표시하며, 선택/삭제/전체삭제 기능을 제공합니다. 제네릭 타입을 지원합니다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
기본 상태 (아이템 있음)
┌────────────────────────────────┐
│  최근 생성              [전체삭제] │  ← title + 전체삭제 버튼
├────────────────────────────────┤
│  ┌───────┐                     │
│  │       │  제목 A      [✕]   │  ← 선택된 항목 (강조)
│  │ thumb │  2026-02-19         │
│  └───────┘  [뱃지]             │
├────────────────────────────────┤
│  ┌───────┐                     │
│  │       │  제목 B      [✕]   │
│  │ thumb │  2026-02-18         │
│  └───────┘                     │
├────────────────────────────────┤
│  ┌───────┐                     │
│  │       │  제목 C      [✕]   │
│  │ thumb │  2026-02-17         │
│  └───────┘                     │
└────────────────────────────────┘

빈 상태 (아이템 없음)
┌────────────────────────────────┐
│  최근 생성                     │
├────────────────────────────────┤
│                                │
│         [emptyIcon]            │
│      이력이 없습니다            │  ← emptyMessage
│                                │
└────────────────────────────────┘

썸네일 없는 항목
┌───────┐
│  ???  │  ← 기본 플레이스홀더 이미지
└───────┘
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| 기본 | 썸네일 + 제목 + 날짜 + 삭제 버튼 목록 |
| 선택됨 | 선택된 항목 배경 강조 (selectedId 매칭) |
| 뱃지 있음 | 썸네일 하단 뱃지 텍스트 표시 |
| 빈 상태 | 아이콘 + 안내 메시지 |

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
| 2026-03-06 | 폴더 네이밍을 단수형(feature/control/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
| 2026-03-06 | widget 디렉토리를 widgets로 통합하며 위치 경로를 정리 | codex |
