# CategoryChildrenSection Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/category/CategoryChildrenSection/

## 역할

카테고리 상세 화면에서 하위 카테고리 목록을 읽기 전용 테이블로 표시합니다. 이름(링크)과 분류된 역할 수 컬럼을 제공합니다.

## Props

```typescript
interface CategoryChildrenSectionProps {
  children: CategoryChildItem[];
  isLoading?: boolean;                     // 기본값: false
  categoriesBasePath?: string;             // 기본값: "/roles/categories"
}

interface CategoryChildItem {
  id: string;
  name: string;
  _count?: {
    roleClassifications?: number;
  };
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| HeroUI Table (removeWrapper) | 하위 카테고리 테이블 |
| HeroUI Link | 카테고리 상세 링크 |
| HeroUI Skeleton | 로딩 스켈레톤 |

## 상태 관리

**없음** (순수 UI)

## 슬롯

없음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
