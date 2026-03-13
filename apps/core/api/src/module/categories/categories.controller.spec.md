# Categories Controller 기획서

> 생성일: 2026-02-18
> 타입: controller
> 위치: `apps/core/api/src/module/categories/categories.controller.ts`

## 역할

Category CRUD API를 노출하며, 현재 Space 기준 생성 흐름과 경계 응답 조립은 `CategoryFacade`에 위임합니다.

## 의존성

| 주입 대상 | 타입 | 설명 |
|-----------|------|------|
| categoryFacade | CategoryFacade | Category 목록/상세/생성/수정/삭제 boundary 유즈케이스 |

## 엔드포인트

| Method | 경로 | Operation ID | 설명 |
|--------|------|-------------|------|
| GET | `/` | `getCategories` | QueryCategoryDto 기반 목록 조회 |
| GET | `/:id` | `getCategoryById` | Category 상세 조회 |
| POST | `/` | `createCategory` | 현재 Space 기준 Category 생성 |
| PATCH | `/:id` | `updateCategory` | Category 수정 |
| DELETE | `/:id` | `deleteCategory` | Category 삭제 |

## 비즈니스 메모

- controller는 `SpaceContext`를 직접 주입하지 않고 Facade 경계만 호출합니다.
- parent/children 검증과 순환 참조 규칙은 Facade 내부 `CategoryService`가 담당합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-03-11 | Controller 의존성을 CategoryService로 전환 | codex |
| 2026-03-13 | 컨트롤러 경계 의존성을 `CategoryFacade` 기준으로 갱신 | codex |
| 2026-03-13 | CategoryController가 SpaceContext 확인 후 CategoryFacade 단일 시그니처로 위임하도록 정리 | codex |
