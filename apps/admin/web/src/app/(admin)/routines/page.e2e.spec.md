# page.e2e e2e 기획서

> 생성일: 2026-03-26
> 타입: e2e
> 위치: apps/admin/web/src/app/(admin)/routines/page.e2e.ts

## 역할

이 파일은 e2e 성격의 경량 구성/배럴 책임을 가지며, 루틴/태스크 fixture 생성과 정리 요청이 브라우저 컨텍스트의 인증/Space 쿠키를 그대로 재사용하도록 유지합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| export | 없음 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-07 | 루틴 E2E의 fixture 생성/정리 API 요청이 별도 Cookie 덮어쓰기 없이 세션 쿠키를 재사용하도록 정리 | codex |
| 2026-03-29 | 루틴 CRUD 이후 보조 fixture task 정리는 409 충돌이 남아도 재시도 후 종료하는 best-effort cleanup으로 완화 | codex |
| 2026-03-29 | HeroUI 입력 제어에서 수정 단계가 흔들리지 않도록 편집 시나리오를 fill 기반으로 고정 | codex |
| 2026-03-29 | 루틴 목록 E2E를 API 응답 대기 기준으로 안정화하고 CRUD 시나리오가 전용 schedulable 운동을 생성해 사용하도록 갱신 | codex |
| 2026-03-26 | 누락된 sidecar spec 신규 생성 | codex |
