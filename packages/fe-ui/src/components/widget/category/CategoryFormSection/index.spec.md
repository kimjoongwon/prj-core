# CategoryFormSection Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/category/CategoryFormSection/

## 역할

카테고리 등록/수정 폼 섹션입니다. 등록 시 이름과 상위 카테고리를 입력하고, 수정 시 이름은 읽기 전용이며 상위 카테고리만 변경 가능합니다.

## Props

```typescript
interface CategoryFormSectionProps {
  mode: "create" | "edit";
  values: CategoryFormValues;
  errors?: CategoryFormErrors;
  categoryOptions: CategoryOption[];
  onChangeField: (field: keyof CategoryFormValues, value: string) => void;
}

interface CategoryFormValues {
  name: string;
  parentId: string;
}

interface CategoryFormErrors {
  name?: string;
  parentId?: string;
}

interface CategoryOption {
  id: string;
  name: string;
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| HeroUI Input | 이름 입력 (등록 시 필수, 수정 시 읽기 전용) |
| HeroUI Select | 상위 카테고리 선택 |

## 상태 관리

**없음** (외부에서 values 상태를 관리)

## 슬롯

없음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
