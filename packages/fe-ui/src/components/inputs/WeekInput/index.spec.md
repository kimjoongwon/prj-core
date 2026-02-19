# WeekInput 기획서

> 생성일: 2026-02-18
> 타입: input
> 위치: packages/fe-ui/src/components/inputs/WeekInput/

## 역할

MobX state와 연동하는 요일 선택 컴포넌트. `useFormField` 훅을 통해 `RecurringDayOfTheWeek` 타입의 양방향 바인딩을 제공한다.

## Props

```typescript
interface WeekInputProps<T> extends MobxProps<T>,
  Omit<BaseWeekInputProps, "value" | "onChange"> {}
```

- `state`: MobX observable 객체
- `path`: state 내 바인딩 경로
- 나머지 BaseWeekInputProps 전달

## 상태

| 상태 | 설명 |
|------|------|
| 초기값 | `tools.get(state, path)` (RecurringDayOfTheWeek) |
| 변경 시 | `formField.setValue(value)`로 state 업데이트 |

## MobX 연동

- `observer`로 래핑
- `useFormField` 훅으로 양방향 바인딩

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
