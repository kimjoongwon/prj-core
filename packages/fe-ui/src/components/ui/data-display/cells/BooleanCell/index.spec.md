# BooleanCell 기획서

> 생성일: 2026-02-18
> 타입: ui (cell)
> 위치: packages/fe-ui/src/components/ui/data-display/cells/BooleanCell/

## 역할

불린 값을 "예/아니오" Chip으로 표시하는 Cell 컴포넌트. null/undefined는 "-"로 표시한다.

## Props

```typescript
interface BooleanCellProps {
  /** 불린 값 */
  value: boolean | null | undefined;
}
```

## 표시 규칙

| 값 | 표시 | Chip color |
|---|---|---|
| `true` | 예 | success |
| `false` | 아니오 | default |
| `null` / `undefined` | - | (plain text) |

## HeroUI 매핑

- `Chip` (size="sm", variant="flat")

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
