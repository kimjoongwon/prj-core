# ChipSelect Input 기획서

> 생성일: 2026-02-18
> 타입: input
> 위치: packages/fe-ui/src/components/inputs/ChipSelect/

## 역할

MobX state와 연동하는 Chip 기반 선택 컴포넌트. single/multiple 선택 모드를 지원한다. `useFormField` 훅을 통해 양방향 바인딩을 제공한다.

## Props

```typescript
interface ChipSelectProps<T> extends MobxProps<T>,
  Omit<BaseChipSelectProps, "value" | "onSelectionChange"> {}
```

- `state`: MobX observable 객체
- `path`: state 내 바인딩 경로
- `options`: 선택 가능한 옵션 목록
- `selectionMode`: "single" | "multiple" (기본값: "multiple")

## 상태

| 모드 | 초기값 | 변경 값 |
|------|------|------|
| single | `tools.get(state, path)` (string 또는 null) | string 또는 null |
| multiple | `tools.get(state, path)` (string[] 또는 빈 배열) | string[] |

## MobX 연동

- `observer`로 래핑
- `useFormField` 훅으로 양방향 바인딩

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
