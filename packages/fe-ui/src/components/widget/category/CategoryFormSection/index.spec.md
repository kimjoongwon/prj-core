# CategoryFormSection Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/category/CategoryFormSection/

## 역할

카테고리 등록/수정 폼 섹션입니다. 등록 시 이름과 상위 카테고리를 입력하고, 수정 시 이름은 읽기 전용이며 상위 카테고리만 변경 가능합니다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
  --- create 모드 ---

  이름 *
  ┌────────────────────────────────────────────────┐
  │ 카테고리 이름 입력                              │
  └────────────────────────────────────────────────┘

  상위 카테고리
  ┌────────────────────────────────────────────────┐
  │ 상위 카테고리 선택 (선택 사항)              ▼  │
  └────────────────────────────────────────────────┘

  --- edit 모드 ---

  이름
  ┌────────────────────────────────────────────────┐
  │ WORKSPACE                    (읽기 전용)        │
  └────────────────────────────────────────────────┘

  상위 카테고리
  ┌────────────────────────────────────────────────┐
  │ PLATFORM                                    ▼  │
  └────────────────────────────────────────────────┘

  --- 에러 상태 ---

  이름 *
  ┌────────────────────────────────────────────────┐
  │                                                │
  └────────────────────────────────────────────────┘
  ⚠ 이름은 필수입니다
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| create 모드 | 이름 필드 편집 가능, 상위 카테고리 선택 가능 |
| edit 모드 | 이름 필드 읽기 전용(회색), 상위 카테고리만 변경 가능 |
| 에러 | 해당 필드 하단에 에러 메시지 표시 |

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
| 2026-02-19 | 디자인 목업 추가 | req-reverse-engineer |
