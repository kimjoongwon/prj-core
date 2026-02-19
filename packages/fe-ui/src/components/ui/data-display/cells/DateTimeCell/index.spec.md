# DateTimeCell 기획서

> 생성일: 2026-02-18
> 타입: ui (cell)
> 위치: packages/fe-ui/src/components/ui/data-display/cells/DateTimeCell/

## 역할

날짜와 시간을 초 단위 제외 형식(YYYY-MM-DD HH:mm)으로 표시하는 Cell 컴포넌트. `@cocrepo/toolkit`의 `formatDateTime`을 사용한다.

## Props

```typescript
interface DateTimeCellProps {
  /** 날짜/시간 값 (ISO 문자열 또는 Date 객체) */
  value: string | Date | null | undefined;
}
```

## 표시 규칙

| 값 | 표시 |
|---|---|
| ISO 문자열 | `formatDateTime()` 결과 (예: 2024-01-15 10:30) |
| `null` / `undefined` | - |

## 의존성

- `@cocrepo/toolkit` - `formatDateTime`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
