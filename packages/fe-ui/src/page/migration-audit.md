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

## 최근 반영

- 2026-03-26: admin/idp web route `page.tsx` 전체를 `packages/fe-ui/src/page` 기반 thin container 구조로 정리
