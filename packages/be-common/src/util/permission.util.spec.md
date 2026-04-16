# permission.util util 기획서

> 생성일: 2026-03-03
> 타입: util
> 위치: packages/be-common/src/util/permission.util.ts

## 역할

현재 선택된 Tenant의 Space category와 현재 tenant role 기준 전체 Space 접근 가능 여부를 판별하는 권한 유틸리티를 제공합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| isRootSpaceCategory | 현재 Tenant의 Space category가 ROOT(System)인지 판별 |
| resolveCurrentTenantForSpace | `spaceId`가 주어지면 동일한 `spaceId`의 첫 번째 tenant를 사용 |
| canAccessAllSpaces | 현재 선택된 Tenant role이 `FULL_ACCESS`면 전체 조회 허용 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-16 | `resolveCurrentTenantForSpace`에서 mirrored 우선순위를 제거하고 `x-space-id` 일치 tenant 단일 매칭 규칙으로 정리 | codex |
| 2026-04-16 | 동일 `spaceId`의 mirrored `FULL_ACCESS`가 branch 고유 tenant를 덮어쓰지 않도록 현재 tenant 선택 helper를 추가 | codex |
| 2026-04-16 | 전체 조회 기준을 ROOT와 분리하고 현재 tenant role `FULL_ACCESS` 단독 규칙으로 정정 | codex |
| 2026-04-15 | 전체 조회 기준을 `ROOT(System) Space + FULL_ACCESS` 조합으로 명시 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
