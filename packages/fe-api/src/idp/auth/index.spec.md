# idp auth index 기획서

> 생성일: 2026-04-08
> 타입: barrel
> 위치: packages/fe-api/src/idp/auth/index.ts

## 역할

IDP auth API 엔트리에서 generated export와 수동 래퍼 export를 함께 노출합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| `./auth` export | Orval generated auth endpoint 전체 재수출 |
| `./current-space` export | current-space 전용 수동 래퍼 재수출 |
| model export | auth audit 관련 모델 재수출 |

## 규칙

- `current-space` 훅은 generated mutation 시그니처(`{ data: payload }`) 대신 수동 래퍼의 간단한 payload 계약(`{ spaceId }`)을 우선 노출합니다.
- admin web과 storybook runtime은 이 barrel을 통해 동일한 current-space 호출 계약을 공유합니다.
- barrel은 explicit local export로 current-space 래퍼를 재노출해 generated overload 충돌 없이 단일 계약을 유지합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-08 | explicit local export로 current-space 래퍼 우선순위를 고정해 generated overload 누수를 차단 | codex |
| 2026-04-08 | custom current-space 래퍼를 barrel에 재수출해 generated mutation 시그니처 누수를 차단 | codex |
