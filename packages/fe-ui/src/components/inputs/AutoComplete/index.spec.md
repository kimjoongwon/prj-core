# AutoComplete Input 기획서

> 생성일: 2026-02-18
> 타입: input
> 위치: packages/fe-ui/src/components/inputs/AutoComplete/

## 역할

MobX state와 연동하는 자동완성(AutoComplete) 입력 컴포넌트. `useFormField` 훅을 통해 state/path 기반 양방향 바인딩을 제공한다. 내부적으로 `BaseAutoComplete` Pure 컴포넌트를 래핑한다.

## Props

```typescript
interface AutoCompleteProps<T> extends MobxProps<T>,
  Omit<BaseAutoCompleteProps, "onSelectionChange"> {}
```

- `state`: MobX observable 객체
- `path`: state 내 바인딩 경로
- `defaultItems`: 자동완성 항목 목록 (`{ key, ... }[]`)
- 나머지 BaseAutoCompleteProps 전달

## 상태

| 상태 | 설명 |
|------|------|
| 초기값 | `defaultItems`에서 `state[path]`와 key가 일치하는 항목 |
| 선택 시 | `formField.setValue(value)`로 state 업데이트 |

## MobX 연동

- `observer`로 래핑
- `useFormField` 훅으로 양방향 바인딩
- `tools.get(state, path)`로 현재 값 읽기

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
