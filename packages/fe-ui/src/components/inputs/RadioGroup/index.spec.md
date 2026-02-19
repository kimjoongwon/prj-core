# RadioGroup Input 기획서

> 생성일: 2026-02-18
> 타입: input
> 위치: packages/fe-ui/src/components/inputs/RadioGroup/

## 역할

MobX state와 연동하는 라디오 그룹 컴포넌트. `useFormField` 훅을 통해 단일 선택 값의 양방향 바인딩을 제공한다.

## Props

```typescript
interface RadioGroupProps<T> extends MobxProps<T>,
  Omit<BaseRadioGroupProps, "value" | "onValueChange"> {}
```

- `state`: MobX observable 객체
- `path`: state 내 바인딩 경로
- `options`: `RadioOption[]` 선택지 목록
- 나머지 BaseRadioGroupProps 전달

## 상태

| 상태 | 설명 |
|------|------|
| 초기값 | `options`에서 `state[path]`와 일치하는 option의 value |
| 변경 시 | `formField.setValue(value)`로 state 업데이트 |

## MobX 연동

- `observer`로 래핑
- `useFormField` 훅으로 양방향 바인딩

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
