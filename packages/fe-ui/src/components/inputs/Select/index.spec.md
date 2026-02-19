# Select Input 기획서

> 생성일: 2026-02-18
> 타입: input
> 위치: packages/fe-ui/src/components/inputs/Select/

## 역할

MobX state와 연동하는 드롭다운 선택 컴포넌트. `useFormField` 훅을 통해 단일 선택 값의 양방향 바인딩을 제공한다.

## Props

```typescript
interface SelectProps<T> extends MobxProps<T>,
  Omit<BaseSelectProps, "value" | "onChange"> {}
```

- `state`: MobX observable 객체
- `path`: state 내 바인딩 경로
- `options`: `{ value: string; ... }[]` 선택지 목록
- 나머지 BaseSelectProps 전달

## 상태

| 상태 | 설명 |
|------|------|
| 초기값 | `options`에서 `state[path]`와 value가 일치하는 option |
| 변경 시 | `formField.setValue(value)`로 state 업데이트 |

## MobX 연동

- `observer`로 래핑
- `useFormField` 훅으로 양방향 바인딩
- `tools.clone(options)`로 옵션 복사 후 비교

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
