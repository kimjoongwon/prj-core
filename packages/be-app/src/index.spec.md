# index 배럴 기획서

> 생성일: 2026-03-03
> 타입: index
> 위치: packages/be-app/src/index.ts

## 역할

이 파일은 index 성격의 경량 구성/배럴 책임을 가집니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| export | `ActionsApplicationService`, `AbilitiesApplicationService`, `AuthApplicationService`, `CategoriesApplicationService`, `GrantsApplicationService`, `GroupsApplicationService`, `InquiriesApplicationService`, `RolesApplicationService`, `RoutinesApplicationService`, `SpacesApplicationService`, `SubjectsApplicationService`, `TasksApplicationService`, `TemplatesApplicationService`, `TimelinesApplicationService`, `TranslationsApplicationService`, `UsersApplicationService` |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-11 | be-app 패키지 export를 ApplicationService 기준으로 재구성 | codex |
| 2026-03-11 | Space/Task/Inquiry aggregate root application service export 추가 | codex |
| 2026-03-11 | 단순 aggregate root 도메인 application service export 추가 | codex |
