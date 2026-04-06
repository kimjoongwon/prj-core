# index 배럴 기획서

> 생성일: 2026-03-13
> 타입: index
> 위치: packages/be-facade/src/index.ts

## 역할

`@cocrepo/facade` 패키지의 배럴 export를 담당하는 시작점입니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| export | `ActionFacade`, `AssetFacade`, `CategoryFacade`, `FolderFacade`, `GrantFacade`, `GroupFacade`, `IdpAccountFacade`, `IdpDashboardFacade`, `InquiryFacade`, `OidcClientFacade`, `OidcSessionFacade`, `RoleFacade`, `RoutineFacade`, `SecurityPolicyFacade`, `SpaceFacade`, `SubjectFacade`, `TaskFacade`, `TemplateFacade`, `TimelineFacade`, `UserFacade` |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-06 | GrantFacade export를 RoleGrantFacade export로 교체 | codex |
| 2026-03-13 | be-facade 패키지 초기 생성 | codex |
| 2026-03-13 | IDP 계정/OIDC Client/OIDC Session facade export 추가 | codex |
| 2026-03-13 | Space/Task/Template/Inquiry facade export 추가 | codex |
| 2026-03-13 | Action/Category/Grant/Group/Role/Routine/Subject/Timeline/Translation/User/IDP Dashboard/Security Policy facade export 추가 | codex |
| 2026-03-13 | frontend 런타임 미사용 translation facade export를 제거 | codex |
| 2026-03-15 | admin assets 복구를 위해 Asset/Folder facade export를 추가 | codex |
