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

## 동작 메모

- `x-space-id`에 매칭되는 tenant를 선택해 CLS `TENANT`에 저장합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-16 | 같은 `spaceId`의 mirrored `FULL_ACCESS`보다 일반 tenant를 우선하는 현재 tenant 해석 규칙을 문서화 | codex |
| 2026-04-16 | `mirrored FULL_ACCESS` 규칙을 제거하고 `x-space-id` 매칭 tenant 그대로 설정하는 규칙으로 정리 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-04-14 | RequestContext가 selectedSpace cookie 대신 x-space-id header를 CLS SPACE_ID/TENANT source로 사용하도록 반영 | codex |
