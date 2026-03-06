# CategoryInfoSection Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/widget/category/CategoryInfoSection/

## 역할

카테고리 상세 화면에서 기본 정보(이름, 유형, 상위 카테고리, 생성일, 수정일)를 2열 그리드로 표시하는 섹션입니다. 상위 카테고리가 있으면 링크로 표시합니다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
  ┌─────────────────────────────────────────────────────┐
  │  이름              │  유형                          │
  │  WORKSPACE         │  ROLE_CATEGORY                 │
  ├─────────────────────────────────────────────────────┤
  │  상위 카테고리      │  생성일                        │
  │  🔗 PLATFORM       │  2026-01-01 09:00:00           │
  ├─────────────────────────────────────────────────────┤
  │  수정일             │                               │
  │  2026-02-15 14:30  │                               │
  └─────────────────────────────────────────────────────┘

  --- 상위 카테고리 없음 ---

  ┌─────────────────────────────────────────────────────┐
  │  이름              │  유형                          │
  │  PLATFORM          │  ROLE_CATEGORY                 │
  ├─────────────────────────────────────────────────────┤
  │  상위 카테고리      │  생성일                        │
  │  없음              │  2026-01-01 09:00:00           │
  ├─────────────────────────────────────────────────────┤
  │  수정일             │                               │
  │  2026-02-15 14:30  │                               │
  └─────────────────────────────────────────────────────┘
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| 상위 카테고리 있음 | 상위 카테고리 셀이 링크(🔗)로 표시 |
| 상위 카테고리 없음 | 상위 카테고리 셀에 "없음" 텍스트 표시 |

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
| 2026-03-06 | 폴더 네이밍을 단수형(feature/input/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 추가 | req-reverse-engineer |
| 2026-03-06 | widget 디렉토리를 widgets로 통합하며 위치 경로를 정리 | codex |
