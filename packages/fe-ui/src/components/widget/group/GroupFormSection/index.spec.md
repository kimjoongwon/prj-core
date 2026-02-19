# GroupFormSection Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/group/GroupFormSection/

## 역할

그룹 등록/수정 폼 섹션입니다. 등록 시 이름과 라벨을 입력하고, 수정 시 이름은 읽기 전용이며 라벨만 수정 가능합니다.

## Props

```typescript
interface GroupFormSectionProps {
  mode: "create" | "edit";
  values: GroupFormValues;
  errors?: GroupFormErrors;
  onChangeField: (field: keyof GroupFormValues, value: string) => void;
}

interface GroupFormValues {
  name: string;
  label: string;
}

interface GroupFormErrors {
  name?: string;
  label?: string;
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| HeroUI Input | 이름 입력 (등록 시 필수, 수정 시 읽기 전용), 라벨 입력 |

## 상태 관리

**없음** (외부에서 values 상태를 관리)

## 슬롯

없음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
