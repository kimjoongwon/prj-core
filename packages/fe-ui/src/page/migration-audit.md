# Page Migration Audit

> 생성일: 2026-03-26
> 기준 경로: apps/admin/web/src/app, apps/idp/web/src/app

## 목적

`packages/fe-ui/src/page/[PageName]/[PageName].tsx` 기반 page 레이어 이관 상태를 기록합니다.

## 현황 요약

- 전체 route `page.tsx`: 79개
- `thin_container`: 79개
- `route_composes_page_ui`: 0개
- `no_ui_import`: 0개
- `pure_page_runtime_violation`: 37개

## Thin Container 완료

- `apps/admin/web/src/app/(admin)/abilities/[abilityId]/edit/page.tsx`
- `apps/admin/web/src/app/(admin)/abilities/[abilityId]/page.tsx`
- `apps/admin/web/src/app/(admin)/abilities/new/page.tsx`
- `apps/admin/web/src/app/(admin)/abilities/page.tsx`
- `apps/admin/web/src/app/(admin)/actions/[actionId]/edit/page.tsx`
- `apps/admin/web/src/app/(admin)/actions/[actionId]/page.tsx`
- `apps/admin/web/src/app/(admin)/actions/new/page.tsx`
- `apps/admin/web/src/app/(admin)/actions/page.tsx`
- `apps/admin/web/src/app/(admin)/assets/[assetId]/page.tsx`
- `apps/admin/web/src/app/(admin)/assets/page.tsx`
- `apps/admin/web/src/app/(admin)/dashboard/page.tsx`
- `apps/admin/web/src/app/(admin)/inquiries/[inquiryId]/edit/page.tsx`
- `apps/admin/web/src/app/(admin)/inquiries/[inquiryId]/page.tsx`
- `apps/admin/web/src/app/(admin)/inquiries/new/page.tsx`
- `apps/admin/web/src/app/(admin)/inquiries/page.tsx`
- `apps/admin/web/src/app/(admin)/roles/[roleId]/abilities/[abilityId]/actions/page.tsx`
- `apps/admin/web/src/app/(admin)/roles/[roleId]/abilities/[abilityId]/subjects/page.tsx`
- `apps/admin/web/src/app/(admin)/roles/[roleId]/edit/page.tsx`
- `apps/admin/web/src/app/(admin)/roles/[roleId]/page.tsx`
- `apps/admin/web/src/app/(admin)/roles/categories/[categoryId]/edit/page.tsx`
- `apps/admin/web/src/app/(admin)/roles/categories/[categoryId]/page.tsx`
- `apps/admin/web/src/app/(admin)/roles/categories/new/page.tsx`
- `apps/admin/web/src/app/(admin)/roles/categories/page.tsx`
- `apps/admin/web/src/app/(admin)/roles/groups/[groupId]/edit/page.tsx`
- `apps/admin/web/src/app/(admin)/roles/groups/[groupId]/page.tsx`
- `apps/admin/web/src/app/(admin)/roles/groups/new/page.tsx`
- `apps/admin/web/src/app/(admin)/roles/groups/page.tsx`
- `apps/admin/web/src/app/(admin)/roles/new/page.tsx`
- `apps/admin/web/src/app/(admin)/roles/page.tsx`
- `apps/admin/web/src/app/(admin)/routines/[routineId]/edit/page.tsx`
- `apps/admin/web/src/app/(admin)/routines/[routineId]/page.tsx`
- `apps/admin/web/src/app/(admin)/routines/new/page.tsx`
- `apps/admin/web/src/app/(admin)/routines/page.tsx`
- `apps/admin/web/src/app/(admin)/spaces/[spaceId]/ground/edit/page.tsx`
- `apps/admin/web/src/app/(admin)/spaces/[spaceId]/ground/page.tsx`
- `apps/admin/web/src/app/(admin)/spaces/new/page.tsx`
- `apps/admin/web/src/app/(admin)/spaces/page.tsx`
- `apps/admin/web/src/app/(admin)/subjects/[subjectId]/page.tsx`
- `apps/admin/web/src/app/(admin)/subjects/page.tsx`
- `apps/admin/web/src/app/(admin)/tasks/[taskId]/exercise/edit/page.tsx`
- `apps/admin/web/src/app/(admin)/tasks/[taskId]/exercise/page.tsx`
- `apps/admin/web/src/app/(admin)/tasks/new/page.tsx`
- `apps/admin/web/src/app/(admin)/tasks/page.tsx`
- `apps/admin/web/src/app/(admin)/templates/[templateId]/edit/page.tsx`
- `apps/admin/web/src/app/(admin)/templates/[templateId]/page.tsx`
- `apps/admin/web/src/app/(admin)/templates/new/page.tsx`
- `apps/admin/web/src/app/(admin)/templates/page.tsx`
- `apps/admin/web/src/app/(admin)/timelines/[timelineId]/edit/page.tsx`
- `apps/admin/web/src/app/(admin)/timelines/[timelineId]/page.tsx`
- `apps/admin/web/src/app/(admin)/timelines/[timelineId]/sessions/[sessionId]/edit/page.tsx`
- `apps/admin/web/src/app/(admin)/timelines/[timelineId]/sessions/[sessionId]/page.tsx`
- `apps/admin/web/src/app/(admin)/timelines/[timelineId]/sessions/[sessionId]/programs/[programId]/edit/page.tsx`
- `apps/admin/web/src/app/(admin)/timelines/[timelineId]/sessions/[sessionId]/programs/[programId]/page.tsx`
- `apps/admin/web/src/app/(admin)/timelines/[timelineId]/sessions/[sessionId]/programs/new/page.tsx`
- `apps/admin/web/src/app/(admin)/timelines/[timelineId]/sessions/new/page.tsx`
- `apps/admin/web/src/app/(admin)/timelines/new/page.tsx`
- `apps/admin/web/src/app/(admin)/timelines/page.tsx`
- `apps/admin/web/src/app/(admin)/users/[userId]/edit/page.tsx`
- `apps/admin/web/src/app/(admin)/users/[userId]/page.tsx`
- `apps/admin/web/src/app/(admin)/users/new/page.tsx`
- `apps/admin/web/src/app/(admin)/users/page.tsx`
- `apps/admin/web/src/app/auth/login/page.tsx`
- `apps/admin/web/src/app/page.tsx`
- `apps/idp/web/src/app/(auth)/error/page.tsx`
- `apps/idp/web/src/app/(auth)/forgot-password/page.tsx`
- `apps/idp/web/src/app/(auth)/interaction/[uid]/page.tsx`
- `apps/idp/web/src/app/(auth)/reset-password/[token]/page.tsx`
- `apps/idp/web/src/app/(console)/accounts/[userId]/page.tsx`
- `apps/idp/web/src/app/(console)/accounts/page.tsx`
- `apps/idp/web/src/app/(console)/auth-audit-logs/page.tsx`
- `apps/idp/web/src/app/(console)/dashboard/page.tsx`
- `apps/idp/web/src/app/(console)/oidc-clients/[oidcClientId]/edit/page.tsx`
- `apps/idp/web/src/app/(console)/oidc-clients/[oidcClientId]/page.tsx`
- `apps/idp/web/src/app/(console)/oidc-clients/new/page.tsx`
- `apps/idp/web/src/app/(console)/oidc-clients/page.tsx`
- `apps/idp/web/src/app/(console)/oidc-sessions/page.tsx`
- `apps/idp/web/src/app/(console)/security-policy/page.tsx`
- `apps/idp/web/src/app/auth/login/page.tsx`
- `apps/idp/web/src/app/page.tsx`

## Route Direct Composition 남음

- 없음

## 별도 확인 필요

- 없음

## Pure Page Runtime 위반 잔여

- `packages/fe-ui/src/page/AdminInquiriesInquiryIdEditPage/AdminInquiriesInquiryIdEditPage.tsx`
- `packages/fe-ui/src/page/AdminInquiriesInquiryIdPage/AdminInquiriesInquiryIdPage.tsx`
- `packages/fe-ui/src/page/AdminInquiriesNewPage/AdminInquiriesNewPage.tsx`
- `packages/fe-ui/src/page/AdminRolesCategoriesCategoryIdEditPage/AdminRolesCategoriesCategoryIdEditPage.tsx`
- `packages/fe-ui/src/page/AdminRolesCategoriesCategoryIdPage/AdminRolesCategoriesCategoryIdPage.tsx`
- `packages/fe-ui/src/page/AdminRolesCategoriesNewPage/AdminRolesCategoriesNewPage.tsx`
- `packages/fe-ui/src/page/AdminRolesCategoriesPage/AdminRolesCategoriesPage.tsx`
- `packages/fe-ui/src/page/AdminRolesGroupsGroupIdEditPage/AdminRolesGroupsGroupIdEditPage.tsx`
- `packages/fe-ui/src/page/AdminRolesGroupsGroupIdPage/AdminRolesGroupsGroupIdPage.tsx`
- `packages/fe-ui/src/page/AdminRolesGroupsNewPage/AdminRolesGroupsNewPage.tsx`
- `packages/fe-ui/src/page/AdminRolesGroupsPage/AdminRolesGroupsPage.tsx`
- `packages/fe-ui/src/page/AdminRolesNewPage/AdminRolesNewPage.tsx`
- `packages/fe-ui/src/page/AdminRolesRoleIdAbilitiesAbilityIdActionsPage/AdminRolesRoleIdAbilitiesAbilityIdActionsPage.tsx`
- `packages/fe-ui/src/page/AdminRolesRoleIdAbilitiesAbilityIdSubjectsPage/AdminRolesRoleIdAbilitiesAbilityIdSubjectsPage.tsx`
- `packages/fe-ui/src/page/AdminRolesRoleIdEditPage/AdminRolesRoleIdEditPage.tsx`
- `packages/fe-ui/src/page/AdminRolesRoleIdPage/AdminRolesRoleIdPage.tsx`
- `packages/fe-ui/src/page/AdminRoutinesNewPage/AdminRoutinesNewPage.tsx`
- `packages/fe-ui/src/page/AdminRoutinesRoutineIdEditPage/AdminRoutinesRoutineIdEditPage.tsx`
- `packages/fe-ui/src/page/AdminRoutinesRoutineIdPage/AdminRoutinesRoutineIdPage.tsx`
- `packages/fe-ui/src/page/AdminSpacesNewPage/AdminSpacesNewPage.tsx`
- `packages/fe-ui/src/page/AdminSpacesSpaceIdGroundEditPage/AdminSpacesSpaceIdGroundEditPage.tsx`
- `packages/fe-ui/src/page/AdminSpacesSpaceIdGroundPage/AdminSpacesSpaceIdGroundPage.tsx`
- `packages/fe-ui/src/page/AdminTasksNewPage/AdminTasksNewPage.tsx`
- `packages/fe-ui/src/page/AdminTasksTaskIdExerciseEditPage/AdminTasksTaskIdExerciseEditPage.tsx`
- `packages/fe-ui/src/page/AdminTasksTaskIdExercisePage/AdminTasksTaskIdExercisePage.tsx`
- `packages/fe-ui/src/page/AdminTemplatesNewPage/AdminTemplatesNewPage.tsx`
- `packages/fe-ui/src/page/AdminTemplatesTemplateIdEditPage/AdminTemplatesTemplateIdEditPage.tsx`
- `packages/fe-ui/src/page/AdminTemplatesTemplateIdPage/AdminTemplatesTemplateIdPage.tsx`
- `packages/fe-ui/src/page/AdminTimelinesNewPage/AdminTimelinesNewPage.tsx`
- `packages/fe-ui/src/page/AdminTimelinesTimelineIdEditPage/AdminTimelinesTimelineIdEditPage.tsx`
- `packages/fe-ui/src/page/AdminTimelinesTimelineIdPage/AdminTimelinesTimelineIdPage.tsx`
- `packages/fe-ui/src/page/AdminTimelinesTimelineIdSessionsNewPage/AdminTimelinesTimelineIdSessionsNewPage.tsx`
- `packages/fe-ui/src/page/AdminTimelinesTimelineIdSessionsSessionIdEditPage/AdminTimelinesTimelineIdSessionsSessionIdEditPage.tsx`
- `packages/fe-ui/src/page/AdminTimelinesTimelineIdSessionsSessionIdPage/AdminTimelinesTimelineIdSessionsSessionIdPage.tsx`
- `packages/fe-ui/src/page/AdminTimelinesTimelineIdSessionsSessionIdProgramsNewPage/AdminTimelinesTimelineIdSessionsSessionIdProgramsNewPage.tsx`
- `packages/fe-ui/src/page/AdminTimelinesTimelineIdSessionsSessionIdProgramsProgramIdEditPage/AdminTimelinesTimelineIdSessionsSessionIdProgramsProgramIdEditPage.tsx`
- `packages/fe-ui/src/page/AdminTimelinesTimelineIdSessionsSessionIdProgramsProgramIdPage/AdminTimelinesTimelineIdSessionsSessionIdProgramsProgramIdPage.tsx`

## 최근 반영

- 2026-03-26: admin/idp web route `page.tsx` 전체를 `packages/fe-ui/src/page` 기반 thin container 구조로 정리
- 2026-03-29: IDP console pure page에서 API/navigation/react-query import를 제거해 pure page runtime 위반을 46개(admin 영역만 남음)까지 축소
- 2026-03-29: admin 목록 페이지(`assets`, `inquiries`, `roles`, `routines`, `spaces`, `tasks`, `templates`, `timelines`)를 pure page + thin route container 구조로 재정의해 pure page runtime 위반을 37개까지 축소
