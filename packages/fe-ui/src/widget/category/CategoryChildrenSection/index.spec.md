# CategoryChildrenSection Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/widget/category/CategoryChildrenSection/

## 역할

카테고리 상세 화면에서 하위 카테고리 목록을 읽기 전용 테이블로 표시합니다. 이름(링크)과 분류된 역할 수 컬럼을 제공합니다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
  ┌──────────────────────────────────┬──────────────┐
  │ 하위 카테고리명                   │ 분류된 역할 수 │
  ├──────────────────────────────────┼──────────────┤
  │ 🔗 WORKSPACE                     │     12       │
  ├──────────────────────────────────┼──────────────┤
  │ 🔗 PROJECT                       │      5       │
  ├──────────────────────────────────┼──────────────┤
  │ 🔗 TECHNICAL                     │      3       │
  └──────────────────────────────────┴──────────────┘

  --- 로딩 중 ---

  ┌──────────────────────────────────┬──────────────┐
  │ 하위 카테고리명                   │ 분류된 역할 수 │
  ├──────────────────────────────────┼──────────────┤
  │ ████████████████                 │   ████       │
  ├──────────────────────────────────┼──────────────┤
  │ ████████████                     │   ██         │
  └──────────────────────────────────┴──────────────┘

  --- 데이터 없음 ---

  ┌──────────────────────────────────────────────────┐
  │            하위 카테고리가 없습니다               │
  └──────────────────────────────────────────────────┘
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| 기본 | 하위 카테고리 목록 링크 + 역할 수 |
| 로딩 중 (isLoading=true) | 행 단위 Skeleton 표시 |
| 데이터 없음 | 빈 테이블 또는 안내 메시지 |

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
| 2026-03-06 | 폴더 네이밍을 단수형(feature/input/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 추가 | req-reverse-engineer |
| 2026-03-06 | widget 디렉토리를 widgets로 통합하며 위치 경로를 정리 | codex |
