# permission.util util 기획서

> 생성일: 2026-03-03
> 타입: util
> 위치: packages/be-common/src/util/permission.util.ts

## 역할

현재 선택된 Tenant가 System(ROOT) Space인지, 그리고 전체 Space 데이터에 접근 가능한지 판별하는 권한 유틸리티를 제공합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| isRootSpaceCategory | 현재 Tenant의 Space category가 ROOT(System)인지 판별 |
| canAccessAllSpaces | 현재 Tenant가 `FULL_ACCESS`이면서 ROOT(System) Space일 때만 전체 조회 허용 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-15 | 전체 조회 기준을 `ROOT(System) Space + FULL_ACCESS` 조합으로 명시 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
