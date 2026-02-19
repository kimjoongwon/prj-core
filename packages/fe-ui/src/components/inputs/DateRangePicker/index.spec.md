# DateRangePicker Input 기획서

> 생성일: 2026-02-18
> 타입: input
> 위치: packages/fe-ui/src/components/inputs/DateRangePicker/

## 역할

MobX state와 연동하는 날짜 범위 선택 컴포넌트. 시작/종료 날짜를 각각 별도의 state 경로(`paths`)로 관리한다. `valueSplitter`/`valueAggregator`를 통해 복합 값을 분리/합성한다.

## Props

```typescript
interface DateRangePickerProps<T> extends
  Omit<BaseDateRangePickerProps, "value" | "onChange"> {
  state: T;
  paths: readonly [Paths<T, 4>, Paths<T, 4>];
}
```

- `state`: MobX observable 객체
- `paths`: `[startPath, endPath]` 시작/종료 날짜 경로 튜플
- 나머지 BaseDateRangePickerProps 전달

## 상태

| 상태 | 설명 |
|------|------|
| 초기값 | `paths[0]`, `paths[1]`에서 각각 ISO 문자열 읽어서 ZonedDateTime으로 변환 |
| 변경 시 | DateRangeValue -> valueSplitter로 start/end 분리 -> 각 path에 저장 |

## 의존성

- `@internationalized/date` - `parseAbsoluteToLocal`, `ZonedDateTime`

## MobX 연동

- `observer`로 래핑
- `useFormField` 훅 (paths, valueSplitter, valueAggregator 활용)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
