# RowActionsCell 기획서

> 생성일: 2026-02-18
> 타입: ui (cell)
> 위치: packages/fe-ui/src/primitive/data-display/cell/RowActionsCell/

## 역할

DataGrid 행의 액션 버튼(상세/수정/삭제)을 표시하는 Cell 컴포넌트. 각 버튼의 표시/비활성화를 개별 제어할 수 있다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
테이블 컬럼 내 표시 (모든 버튼 표시):

┌──────────────────────┐
│ 액션                  │
├──────────────────────┤
│ [👁] [✏️] [🗑]      │  ← 상세 / 수정 / 삭제 (아이콘 전용 버튼)
├──────────────────────┤
│ [👁] [✏️] [🗑]      │
└──────────────────────┘

버튼별 상세:
  [👁]  Eye 아이콘  → /basePath/id       (light 버튼, Link)
  [✏️] Pencil 아이콘 → /basePath/id/edit  (light 버튼, Link)
  [🗑]  Trash2 아이콘 → onDelete() 콜백   (danger 버튼)

일부 버튼 숨김 (showView=false, showEdit=false):

┌──────────────────────┐
│ 액션                  │
├──────────────────────┤
│ [🗑]                 │  ← 삭제 버튼만 표시
└──────────────────────┘

비활성화 상태:

┌──────────────────────┐
│ 액션                  │
├──────────────────────┤
│ [👁] [✏️̶] [🗑̶]     │  ← 수정/삭제 비활성화
└──────────────────────┘
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| 전체 버튼 | `[👁] [✏️] [🗑]` |
| 상세만 | `[👁]` |
| 수정+삭제만 | `[✏️] [🗑]` |
| 삭제 비활성화 | `[👁] [✏️] [🗑(비활성)]` |

## Props

```typescript
interface RowActionsCellProps {
  /** 아이템 ID */
  id: string;
  /** 기본 경로 (예: "/users") */
  basePath: string;
  /** 상세 보기 표시 여부 @default true */
  showView?: boolean;
  /** 수정 버튼 표시 여부 @default true */
  showEdit?: boolean;
  /** 삭제 버튼 표시 여부 @default true */
  showDelete?: boolean;
  /** 수정 버튼 비활성화 @default false */
  disableEdit?: boolean;
  /** 삭제 버튼 비활성화 @default false */
  disableDelete?: boolean;
  /** 삭제 버튼 클릭 핸들러 */
  onDelete?: () => void;
}
```

## 버튼 구성

| 버튼 | 아이콘 | 링크/동작 | 조건 |
|---|---|---|---|
| 상세 보기 | Eye | `{basePath}/{id}` | showView |
| 수정 | Pencil | `{basePath}/{id}/edit` | showEdit |
| 삭제 | Trash2 | onDelete 콜백 | showDelete |

## HeroUI 매핑

- `Button` (size="sm", variant="light", isIconOnly) + `Link` (as prop)
- 삭제 버튼만 color="danger"
- lucide-react 아이콘: `Eye`, `Pencil`, `Trash2` (h-4 w-4)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 폴더 네이밍을 단수형(feature/input/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
