# ListboxSelect Input 기획서

> 생성일: 2026-02-18
> 타입: input
> 위치: packages/fe-ui/src/components/inputs/ListboxSelect/

## 역할

MobX state와 연동하는 Listbox 기반 선택 컴포넌트. single/multiple 선택 모드를 지원한다. `useFormField` 훅을 통해 양방향 바인딩을 제공한다. `ListboxWrapper`도 함께 export한다.

## Props

```typescript
interface ListboxSelectProps<T> extends MobxProps<T>,
  Omit<BaseListboxSelectProps<T>, "defaultSelectedKeys" | "onSelectionChange"> {}
```

- `state`: MobX observable 객체
- `path`: state 내 바인딩 경로
- `selectionMode`: "single" | "multiple" (기본값: "multiple")
- 나머지 BaseListboxSelectProps 전달

## 상태

| 모드 | 변경 시 |
|------|------|
| single | 선택된 첫 번째 키를 string으로 저장 |
| multiple | 선택된 모든 키를 string[]로 저장 |

## MobX 연동

- `observer`로 래핑
- `useFormField` 훅으로 양방향 바인딩
- `Set` 기반 defaultSelectedKeys 관리

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
