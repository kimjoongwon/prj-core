# DateCell 기획서

> 생성일: 2026-02-18
> 타입: ui (cell)
> 위치: packages/fe-ui/src/components/ui/data-display/cells/DateCell/

## 역할

날짜를 초 단위까지 포함한 형식(YYYY-MM-DD HH:mm:ss)으로 표시하는 Cell 컴포넌트. `@cocrepo/toolkit`의 `formatDateTimeWithSeconds`를 사용한다.

## Props

```typescript
interface DateCellProps {
  /** 날짜 값 (ISO 문자열 또는 Date 객체) */
  value: string | Date | null | undefined;
}
```

## 표시 규칙

| 값 | 표시 |
|---|---|
| ISO 문자열 | `formatDateTimeWithSeconds()` 결과 (예: 2024-01-15 10:30:45) |
| `null` / `undefined` | - |

## 의존성

- `@cocrepo/toolkit` - `formatDateTimeWithSeconds`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
