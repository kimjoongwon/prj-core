# ActiveStatusCell 기획서

> 생성일: 2026-02-18
> 타입: ui (cell)
> 위치: packages/fe-ui/src/components/ui/data-display/cells/ActiveStatusCell/

## 역할

활성/비활성 상태를 HeroUI Chip으로 표시하는 Cell 컴포넌트. DataGrid에서 boolean 상태값을 시각적으로 구분하여 보여준다.

## Props

```typescript
interface ActiveStatusCellProps {
  /** 활성 여부 */
  isActive: boolean;
}
```

## 표시 규칙

| 값 | 표시 텍스트 | Chip color |
|---|---|---|
| `true` | 활성 | success |
| `false` | 비활성 | default |

## HeroUI 매핑

- `Chip` (size="sm", variant="flat")
- 중앙 정렬 (`flex w-full justify-center`)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
