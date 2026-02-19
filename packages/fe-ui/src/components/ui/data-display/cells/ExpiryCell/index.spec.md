# ExpiryCell 기획서

> 생성일: 2026-02-18
> 타입: ui (cell)
> 위치: packages/fe-ui/src/components/ui/data-display/cells/ExpiryCell/

## 역할

만료 시간과 남은 시간을 함께 표시하는 Cell 컴포넌트. 상단에 날짜/시간, 하단에 상대 시간(남은 시간 또는 "만료됨")을 표시한다.

## Props

```typescript
interface ExpiryCellProps {
  /** 만료 시간 (ISO 문자열 또는 Date 객체) */
  expiresAt: string | Date | null | undefined;
}
```

## 표시 규칙

| 조건 | 상단 표시 | 하단 표시 | 하단 색상 |
|---|---|---|---|
| 미래 시간 (일 단위) | formatDateTime 결과 | `Xd Yh 남음` | text-success |
| 미래 시간 (시 단위) | formatDateTime 결과 | `Xh Ym 남음` | text-success |
| 미래 시간 (분 단위) | formatDateTime 결과 | `Xm 남음` | text-success |
| 과거 시간 | formatDateTime 결과 | 만료됨 | text-danger |
| `null` / `undefined` | - | (없음) | text-default-400 |

## 의존성

- `@cocrepo/toolkit` - `formatDateTime`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
