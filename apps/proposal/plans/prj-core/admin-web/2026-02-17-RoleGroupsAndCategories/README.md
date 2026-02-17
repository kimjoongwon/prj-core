# RoleGroupsAndCategories (역할 그룹 및 카테고리 관리)

## 개요

기존 역할 관리(`/roles`) 도메인의 확장으로, Role Group과 Role Category를 독립적으로 CRUD 관리하는 기능입니다.

## 기능 범위

| 도메인 | 페이지 | 경로 |
|--------|--------|------|
| 역할 그룹 | 목록 | `/roles/groups` |
| 역할 그룹 | 상세 | `/roles/groups/[groupId]` |
| 역할 그룹 | 등록 | `/roles/groups/new` |
| 역할 그룹 | 수정 | `/roles/groups/[groupId]/edit` |
| 역할 카테고리 | 목록 | `/roles/categories` |
| 역할 카테고리 | 상세 | `/roles/categories/[categoryId]` |
| 역할 카테고리 | 등록 | `/roles/categories/new` |
| 역할 카테고리 | 수정 | `/roles/categories/[categoryId]/edit` |

## 기획서 구조

| 파일 | 내용 | 레이어 |
|------|------|--------|
| `01-overview.md` | 시스템 컨텍스트, 사용자, 목표 | L0-L2 |
| `02-structure.md` | 기능, 화면 구조 | L3-L4 |
| `03-interactions.md` | 인터랙션, API 엔드포인트 | L5-L6 |
| `04-ui-details.md` | 데이터 모델, UI 컴포넌트 | L7-L8 |
| `05-technical-design.md` | 비즈니스 로직, 테스트 케이스 | L9-L10 |

## 구현 단계 (5단계 플로우)

| Stage | 작업 | 에이전트 |
|-------|------|----------|
| 2 | 스키마 (기존 모델 활용, DTO 보완) | `be-dto-builder`, `be-query-dto-builder` |
| 3 | 백엔드 (Groups/Categories API) | `be-repository-builder`, `be-service-builder`, `be-controller-builder`, `be-bootstrap-integrator` |
| 4 | 컴포넌트 (페이지별) | `fe-cell-builder`, `fe-widget-builder` |
| 5 | 페이지 (페이지별) | `fe-page-builder`, `fe-menu-builder` |

> Stage 1(기획)은 이 문서 세트로 완료됨.
> Stage 2에서 Prisma 스키마 변경 없음 (기존 Group/Category 모델 활용).

## 핵심 설계 결정

1. **범용 모델 재사용**: Group/Category는 `type=Role` 필터로 역할 전용 데이터만 조회
2. **카테고리 계층 구조**: parentId 기반 트리, 순환 참조 검증 필수
3. **삭제 정책**: Group은 연결 Role 있어도 삭제 허용, Category는 하위 카테고리 있으면 삭제 거부
4. **API 경로**: `/api/v1/groups`, `/api/v1/categories` (범용 엔드포인트)
