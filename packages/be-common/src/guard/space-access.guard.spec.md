# space-access.guard util 기획서

> 생성일: 2026-03-03
> 타입: util
> 위치: packages/be-common/src/guard/space-access.guard.ts

## 역할

이 파일은 util 성격의 경량 구성/배럴 책임을 가집니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| SpaceAccessGuard | `x-space-id`와 `tenant.space.id ?? tenant.spaceId`를 대조해 현재 Space 접근을 검증 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-25 | tenant 매칭 기준을 `tenant.space.id ?? tenant.spaceId`로 보정 | codex |
| 2026-04-25 | `x-space-id`가 있는 인증 요청에서 tenants 배열이 없으면 통과하지 않고 403으로 차단하도록 정리 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-04-14 | SpaceAccessGuard의 필수 입력 계약을 selectedSpace cookie에서 x-space-id header로 전환 | codex |
