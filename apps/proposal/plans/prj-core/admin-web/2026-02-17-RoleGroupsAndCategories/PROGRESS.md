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

## Stage 2: 스키마
- [ ] DTO 보완 (QueryGroupDto에 type, label 필드 추가)
- [ ] UpdateGroupDto, UpdateCategoryDto 확인/보완

## Stage 3: 백엔드
- [ ] GroupsRepository 생성
- [ ] CategoriesRepository 생성
- [ ] GroupsService 생성
- [ ] CategoriesService 생성
- [ ] GroupsController 생성 (`/api/v1/groups`)
- [ ] CategoriesController 생성 (`/api/v1/categories`)
- [ ] AppModule 등록
- [ ] Orval codegen 재실행

## Stage 4: 컴포넌트 (페이지별)
- [ ] RoleGroupList 컴포넌트
- [ ] RoleGroupDetail 컴포넌트
- [ ] RoleGroupNew 컴포넌트
- [ ] RoleGroupEdit 컴포넌트
- [ ] RoleCategoryList 컴포넌트
- [ ] RoleCategoryDetail 컴포넌트
- [ ] RoleCategoryNew 컴포넌트
- [ ] RoleCategoryEdit 컴포넌트
- [ ] 메뉴 업데이트 (admin-menu.ts)

## Stage 5: 페이지 (페이지별)
- [ ] /roles/groups 페이지
- [ ] /roles/groups/[groupId] 페이지
- [ ] /roles/groups/new 페이지
- [ ] /roles/groups/[groupId]/edit 페이지
- [ ] /roles/categories 페이지
- [ ] /roles/categories/[categoryId] 페이지
- [ ] /roles/categories/new 페이지
- [ ] /roles/categories/[categoryId]/edit 페이지
