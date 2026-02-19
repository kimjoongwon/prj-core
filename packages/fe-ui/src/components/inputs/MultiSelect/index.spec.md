# MultiSelect Input 기획서

> 생성일: 2026-02-18
> 타입: input
> 위치: packages/fe-ui/src/components/inputs/MultiSelect/

## 역할

MobX state와 연동하는 다중 선택 컴포넌트. `useFormField` 훅을 통해 string 배열의 양방향 바인딩을 제공한다. HeroUI Select의 multiple 모드를 래핑한다.

## Props

```typescript
interface MultiSelectProps<T> extends MobxProps<T>,
  Omit<BaseMultiSelectProps<T>, "selectedKeys" | "onChange"> {}
```

- `state`: MobX observable 객체
- `path`: state 내 바인딩 경로
- 나머지 BaseMultiSelectProps 전달

## 상태

| 상태 | 설명 |
|------|------|
| 초기값 | `tools.get(state, path)` (string[] 또는 빈 배열) |
| 변경 시 | `e.target.value.split(",")` -> `formField.setValue()` |

## MobX 연동

- `observer`로 래핑
- `useFormField` 훅으로 양방향 바인딩
- `Set`으로 selectedKeys 관리

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
