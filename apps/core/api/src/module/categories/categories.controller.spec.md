# Categories Controller 기획서

> 생성일: 2026-02-18
> 타입: controller
> 위치: `apps/core/api/src/module/categories/categories.controller.ts`

## 역할

Category CRUD API를 노출하며, 현재 Space 기준 생성 흐름을 포함한 실제 유즈케이스는 `CategoriesService`에 위임합니다.

## 의존성

| 주입 대상 | 타입 | 설명 |
|-----------|------|------|
| categoriesService | CategoriesService | Category 목록/상세/생성/수정/삭제 유즈케이스 |

## 엔드포인트

| Method | 경로 | Operation ID | 설명 |
|--------|------|-------------|------|
| GET | `/` | `getCategories` | QueryCategoryDto 기반 목록 조회 |
| GET | `/:id` | `getCategoryById` | Category 상세 조회 |
| POST | `/` | `createCategory` | 현재 Space 기준 Category 생성 |
| PATCH | `/:id` | `updateCategory` | Category 수정 |
| DELETE | `/:id` | `deleteCategory` | Category 삭제 |

## 비즈니스 메모

- controller는 더 이상 `SpaceContext`를 직접 주입받지 않습니다.
- parent/children 검증과 순환 참조 검사는 Service 계층 규칙을 그대로 따릅니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-03-11 | Controller 의존성을 CategoriesService로 전환 | codex |
