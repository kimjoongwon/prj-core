# PROGRESS - RoleGroupsAndCategories

## Stage 1: 기획
- [x] L0-L2 기획 (컨텍스트, Actor, Goal) 완료 (2026-02-17)
  - 생성: `01-overview.md`
- [x] L3-L4 기획 (Feature, Screen) 완료 (2026-02-17)
  - 생성: `02-structure.md`
- [x] L5-L6 기획 (Action, API) 완료 (2026-02-17)
  - 생성: `03-interactions.md`
- [x] L7-L8 기획 (Entity, Component) 완료 (2026-02-17)
  - 생성: `04-ui-details.md`
- [x] L9-L10 기획 (Logic, Test) 완료 (2026-02-17)
  - 생성: `05-technical-design.md`

## Stage 2: 스키마 ✅ COMPLETED (2026-02-17)
- [x] DTO 보완 (QueryGroupDto에 type, label, spaceId 필드 추가, serviceId 제거)
- [x] UpdateGroupDto, UpdateCategoryDto 확인/보완

## Stage 3: 백엔드 ✅ COMPLETED (2026-02-17)
- [x] GroupsRepository 생성 (`packages/be-repository/src/groups.repository.ts`)
- [x] CategoriesRepository 생성 (`packages/be-repository/src/categories.repository.ts`)
- [x] GroupsService 생성 (`packages/be-service/src/groups.service.ts`)
- [x] CategoriesService 생성 (`packages/be-service/src/categories.service.ts`)
- [x] GroupsController 생성 (`apps/server/src/module/group/groups.controller.ts`)
- [x] CategoriesController 생성 (`apps/server/src/module/category/categories.controller.ts`)
- [x] AppModule 등록 (GroupsModule, CategoriesModule)
- [ ] Orval codegen 재실행 (서버 실행 후 진행 예정)

## Stage 4: 컴포넌트 ✅ COMPLETED (2026-02-17)
- [x] ParentCategoryCell 생성 (`packages/fe-ui/src/components/ui/data-display/cells/ParentCategoryCell/`)
- [x] GroupInfoSection 위젯 생성 (`packages/fe-ui/src/components/widget/group/GroupInfoSection/`)
- [x] GroupFormSection 위젯 생성 (`packages/fe-ui/src/components/widget/group/GroupFormSection/`)
- [x] GroupRoleListSection 위젯 생성 (`packages/fe-ui/src/components/widget/group/GroupRoleListSection/`)
- [x] CategoryInfoSection 위젯 생성 (`packages/fe-ui/src/components/widget/category/CategoryInfoSection/`)
- [x] CategoryFormSection 위젯 생성 (`packages/fe-ui/src/components/widget/category/CategoryFormSection/`)
- [x] CategoryRoleListSection 위젯 생성 (`packages/fe-ui/src/components/widget/category/CategoryRoleListSection/`)
- [x] CategoryChildrenSection 위젯 생성 (`packages/fe-ui/src/components/widget/category/CategoryChildrenSection/`)
- [x] 메뉴 업데이트 (`packages/common-constant/src/routing/admin-menu.ts`)
- [x] index.ts exports 업데이트 (cells, widget)

## Stage 5: 페이지 ✅ COMPLETED (2026-02-17)
- [x] /roles/groups 목록 페이지 (`apps/admin/src/app/(admin)/roles/groups/`)
- [x] /roles/groups/[groupId] 상세 페이지 (`apps/admin/src/app/(admin)/roles/groups/[groupId]/`)
- [x] /roles/groups/new 등록 페이지 (`apps/admin/src/app/(admin)/roles/groups/new/`)
- [x] /roles/groups/[groupId]/edit 수정 페이지 (`apps/admin/src/app/(admin)/roles/groups/[groupId]/edit/`)
- [x] /roles/categories 목록 페이지 (`apps/admin/src/app/(admin)/roles/categories/`)
- [x] /roles/categories/[categoryId] 상세 페이지 (`apps/admin/src/app/(admin)/roles/categories/[categoryId]/`)
- [x] /roles/categories/new 등록 페이지 (`apps/admin/src/app/(admin)/roles/categories/new/`)
- [x] /roles/categories/[categoryId]/edit 수정 페이지 (`apps/admin/src/app/(admin)/roles/categories/[categoryId]/edit/`)

## Stage 6: E2E 검증 ✅ COMPLETED (2026-02-17)
- [x] Groups API E2E 테스트 (`apps/server/test/groups.e2e-spec.ts`)
  - Happy Path 5개: 목록 조회, 필터링 조회, 생성, 상세 조회, label 수정, 삭제
  - Error Path 8개: 401 인증 (5개), X-Space-ID 누락, 400 유효성, UUID 형식, 409 중복, 404 (3개), 403 권한 (3개 구조)
  - Edge Case 3개: 삭제 후 재생성, 빈 body 수정, MANAGE 이상 조회
- [x] Categories API E2E 테스트 (`apps/server/test/categories.e2e-spec.ts`)
  - Happy Path 5개: 목록 조회, 필터링 조회, 상세 조회, 최상위/하위 카테고리 생성, 삭제
  - Error Path 6개: 401 인증 (3개), 409 중복, 400 하위 카테고리 존재 시 삭제, 404 (2개), 403 권한 (2개 구조)
  - Edge Case 5개: 자기 참조 400, 순환 참조 400, 순차 삭제, null로 최상위 이동, UUID 형식

### 남은 작업 (후속)
- [ ] Orval codegen 실행 후 customInstance → Orval 훅 교체
- [ ] SSR Prefetch (_prefetch.ts + HydrationBoundary) 추가
