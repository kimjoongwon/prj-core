# Categories Facade 기획서

> 생성일: 2026-03-11
> 타입: application-service
> 위치: packages/be-facade/src/category.facade.ts

## 역할

Category 컨트롤러에서 SpaceContext 의존성을 제거하고, 현재 Space 기준 생성/조회 흐름을 Facade에서 연결합니다.

## 의존성

| 의존성 | 역할 |
|--------|------|
| CategoryService | Category CRUD 유즈케이스 수행 |
| SpaceContext | 현재 요청의 spaceId와 effective spaceIds 제공 |

## 공개 메서드

| 메서드 | 설명 |
|--------|------|
| getCategories | QueryCategoryDto와 effective spaceIds 기반 목록 조회 |
| getCategoryById | effective spaceIds 기반 Category 상세 조회 |
| createCategory | 현재 spaceId를 주입해 Category 생성 |
| updateCategory | Category 수정 |
| deleteCategory | Category 삭제 |

## 비즈니스 규칙

- Category 생성은 항상 현재 요청 Space 기준으로 수행됩니다.
- Category 목록/상세 조회는 현재 tenant가 `FULL_ACCESS`인 경우 전체 Space를 허용하고, 그 외에는 `SpaceContext.spaceIds`로 제한합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-11 | Categories 도메인 thin wrapper facade 신규 생성 | codex |
| 2026-03-13 | CategoryFacade boundary 조합을 `@cocrepo/facade`로 이관 | codex |
| 2026-04-25 | Category 목록/상세 조회에 effective space scope 전달 규칙 추가 | codex |
