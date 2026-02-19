# CategoryInfoSection Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/category/CategoryInfoSection/

## 역할

카테고리 상세 화면에서 기본 정보(이름, 유형, 상위 카테고리, 생성일, 수정일)를 2열 그리드로 표시하는 섹션입니다. 상위 카테고리가 있으면 링크로 표시합니다.

## Props

```typescript
interface CategoryInfoSectionProps {
  category: CategoryInfo;
  categoriesBasePath?: string;  // 기본값: "/roles/categories"
}

interface CategoryInfo {
  name: string;
  type: string;
  parentId?: string | null;
  parent?: {
    id: string;
    name: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| HeroUI Link | 상위 카테고리 상세 링크 |

## 상태 관리

**없음** (순수 UI)

## 슬롯

없음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
