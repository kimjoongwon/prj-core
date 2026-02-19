# Tabs Input 기획서

> 생성일: 2026-02-18
> 타입: input
> 위치: packages/fe-ui/src/components/inputs/Tabs/

## 역할

MobX state와 연동하는 탭 선택 컴포넌트. `useFormField` 훅을 통해 선택된 탭 키의 양방향 바인딩을 제공한다.

## Props

```typescript
interface TabsProps<T> extends MobxProps<T>,
  Omit<BaseTabsProps, "selectedKey" | "onSelectionChange"> {}
```

- `state`: MobX observable 객체
- `path`: state 내 바인딩 경로
- `options`: 탭 목록 (BaseTabsProps에서 정의)

## 상태

| 상태 | 설명 |
|------|------|
| 초기값 | `tools.get(state, path)` |
| 변경 시 | `formField.setValue(key)`로 state 업데이트 |

## MobX 연동

- `observer`로 래핑
- `useFormField` 훅으로 양방향 바인딩
- selectedKey는 `String()`으로 변환하여 전달

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
