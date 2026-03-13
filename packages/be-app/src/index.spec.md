# index 배럴 기획서

> 생성일: 2026-03-03
> 타입: index
> 위치: packages/be-app/src/index.ts

## 역할

이 파일은 workflow 성격의 ApplicationService export만 노출합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| export | `AbilityApplicationService`, `AuthApplicationService` |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-11 | be-app 패키지 export를 ApplicationService 기준으로 재구성 | codex |
| 2026-03-11 | Space/Task/Inquiry aggregate root application service export 추가 | codex |
| 2026-03-11 | 단순 aggregate root 도메인 application service export 추가 | codex |
| 2026-03-12 | IDP 모듈 유즈케이스를 @cocrepo/app ApplicationService로 정리 | codex |
| 2026-03-12 | IDP 모듈 단일 유즈케이스를 `@cocrepo/service` 직접 주입으로 정렬하며 불필요한 app service 제거 | codex |
| 2026-03-13 | IDP 계정/OIDC Client/OIDC Session boundary 조합을 `@cocrepo/facade`로 이관 | codex |
| 2026-03-13 | Space/Task/Template/Inquiry boundary 조합을 `@cocrepo/facade`로 이관 | codex |
| 2026-03-13 | 단일 aggregate root boundary 조합을 `@cocrepo/facade`로 이관하고 workflow만 be-app에 유지 | codex |
