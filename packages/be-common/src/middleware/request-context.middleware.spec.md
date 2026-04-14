# request-context.middleware util 기획서

> 생성일: 2026-03-03
> 타입: util
> 위치: packages/be-common/src/middleware/request-context.middleware.ts

## 역할

이 파일은 util 성격의 경량 구성/배럴 책임을 가집니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| RequestContextMiddleware | 공개 계약 요소 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-04-14 | RequestContext가 selectedSpace cookie 대신 x-space-id header를 CLS SPACE_ID/TENANT source로 사용하도록 반영 | codex |
