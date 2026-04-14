# admin login helper 기획서

> 생성일: 2026-03-04
> 타입: util
> 위치: apps/test/e2e/tests/admin/helpers/login.ts

## 역할

Admin E2E에서 재사용하는 로그인 래퍼입니다.

- 공통 OIDC 로그인 플로우를 호출합니다.
- Admin 앱 전용 후처리(localStorage의 `admin-persist` Space 보정)를 수행합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| `loginToAdmin(page)` | Admin 로그인 + Space 보정 + 즉시 readback 검증 |
| `seedAdminPersist(page, nextSpace)` | 현재 브라우저 컨텍스트의 `admin-persist` localStorage에 Space 정보를 강제로 주입 |
| `readAdminPersist(page)` | 현재 브라우저 컨텍스트의 `admin-persist`를 읽고 Space 정보가 준비될 때까지 대기 |
| `prewarmAdminRoutes(page)` | 주요 admin route를 순차 방문해 dev on-demand compile을 setup 단계에서 흡수 |

## 비즈니스 메모

- route prewarm은 login 이후 동일한 인증 컨텍스트에서 수행되어 storageState와 localStorage를 그대로 재사용합니다.
- `loginToAdmin(page)`는 admin origin의 current-space 엔드포인트로 System Space 선택 가능 여부를 검증한 뒤 `/admin/dashboard` origin에 `admin-persist`를 기록해 후속 setup storageState가 Space 선택 상태를 재사용하게 합니다.
- prewarm은 개별 route 실패를 무시하고 계속 진행해 setup 전체를 막지 않습니다.
- prewarm route navigation은 best-effort이므로 짧은 timeout으로 제한해 setup 전체 timeout을 잠식하지 않습니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-14 | current-space helper가 selectedSpace 쿠키 설정이 아니라 Space 검증 응답을 사용하도록 설명을 갱신 | codex |
| 2026-04-08 | 로그인 직후 `admin-persist`를 직접 seed/readback하고 prewarm per-route timeout을 추가해 setup storageState에 Space 상태가 남도록 보강 | codex |
| 2026-03-16 | 로그인 helper에 주요 admin route prewarm을 추가해 첫 route 진입 compile race를 setup 단계로 이동 | codex |
| 2026-03-14 | Admin setup flaky 원인인 `networkidle`/polling 대기를 제거하고 DOM 준비 + 즉시 readback 검증으로 단순화 | codex |
| 2026-03-06 | 공통 로그인 헬퍼 import를 `@cocrepo/e2e`(fe-e2e 패키지)로 전환 | codex |
| 2026-03-04 | 공통 OIDC 헬퍼 연동 구조로 리팩터링 및 sidecar spec 생성 | codex |
| 2026-03-04 | 공통 OIDC 헬퍼 import를 `@cocrepo/e2e`로 전환 | codex |
