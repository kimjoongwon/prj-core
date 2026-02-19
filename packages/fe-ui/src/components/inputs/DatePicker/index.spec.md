# DatePicker Input 기획서

> 생성일: 2026-02-18
> 타입: input
> 위치: packages/fe-ui/src/components/inputs/DatePicker/

## 역할

MobX state와 연동하는 날짜 선택 컴포넌트. ISO 문자열을 `@internationalized/date`의 `ZonedDateTime`으로 변환하여 관리한다. `useFormField` 훅을 통해 양방향 바인딩을 제공한다.

## Props

```typescript
interface DatePickerProps<T> extends MobxProps<T>,
  Omit<BaseDatePickerProps, "value" | "onChange"> {}
```

- `state`: MobX observable 객체
- `path`: state 내 바인딩 경로
- 나머지 BaseDatePickerProps 전달

## 상태

| 상태 | 설명 |
|------|------|
| 초기값 | `tools.get(state, path)` ISO 문자열 -> `parseAbsoluteToLocal()` |
| 변경 시 | ISO 문자열 -> `parseAbsoluteToLocal()` -> `formField.setValue()` |

## 의존성

- `@internationalized/date` - `parseAbsoluteToLocal`

## MobX 연동

- `observer`로 래핑
- `useFormField` 훅으로 양방향 바인딩

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
