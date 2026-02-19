# NumberCell 기획서

> 생성일: 2026-02-18
> 타입: ui (cell)
> 위치: packages/fe-ui/src/components/ui/data-display/cells/NumberCell/

## 역할

숫자를 천 단위 구분자(toLocaleString)와 함께 표시하는 Cell 컴포넌트.

## Props

```typescript
interface NumberCellProps {
  /** 숫자 값 */
  value: number | string | null | undefined;
}
```

## 표시 규칙

| 값 | 표시 |
|---|---|
| `1234567` | 1,234,567 |
| `"1000"` (문자열) | 1,000 |
| `null` / `undefined` / `""` | - |
| NaN 변환 불가 | - |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
