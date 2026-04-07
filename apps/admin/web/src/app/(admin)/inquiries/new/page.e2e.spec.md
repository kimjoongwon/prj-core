# page.e2e e2e 기획서

> 생성일: 2026-03-26
> 타입: e2e
> 위치: apps/admin/web/src/app/(admin)/inquiries/new/page.e2e.ts

## 역할

이 파일은 e2e 성격의 경량 구성/배럴 책임을 가지며, 문의 접수 화면의 접근 권한 확인과 초기 bootstrap 로딩이 끝난 뒤 주요 폼 요소를 검증합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| export | 없음 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-07 | 문의 접수 첫 진입 시 on-demand compile 시간을 고려해 제목 확인 timeout을 15초로 확장 | codex |
| 2026-04-07 | 문의 접수 E2E가 접근 권한 확인과 초기 bootstrap 로딩 완료 후 폼을 검증하도록 대기 조건을 보강 | codex |
| 2026-03-26 | 누락된 sidecar spec 신규 생성 | codex |
