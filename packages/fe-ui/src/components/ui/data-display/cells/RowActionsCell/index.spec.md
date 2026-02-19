# RowActionsCell 기획서

> 생성일: 2026-02-18
> 타입: ui (cell)
> 위치: packages/fe-ui/src/components/ui/data-display/cells/RowActionsCell/

## 역할

DataGrid 행의 액션 버튼(상세/수정/삭제)을 표시하는 Cell 컴포넌트. 각 버튼의 표시/비활성화를 개별 제어할 수 있다.

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
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
