# DefaultCell 기획서

> 생성일: 2026-02-18
> 타입: ui (cell)
> 위치: packages/fe-ui/src/components/ui/data-display/cells/DefaultCell/

## 역할

기본 텍스트/숫자 값을 표시하는 Cell 컴포넌트. 빈 값(falsy, 단 0 제외)은 "-"로 표시한다.

## Props

```typescript
interface DefaultCellProps {
  /** 표시할 값 */
  value: string | number;
}
```

## 표시 규칙

| 값 | 표시 |
|---|---|
| 유효한 문자열/숫자 | `String(value)` |
| `0` | "0" (정상 표시) |
| 빈 문자열, falsy | - |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
