# abilities util 기획서

> 생성일: 2026-03-26
> 타입: util
> 위치: packages/be-prisma/src/reference-data/definitions/abilities.ts

## 역할

이 파일은 util 성격의 경량 구성/배럴 책임을 가집니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| AbilityAction | 공개 계약 요소 |
| AbilitySeedData | 공개 계약 요소 |
| fullAccessAbilitySeedData | 공개 계약 요소 |
| manageAbilitySeedData | 공개 계약 요소 |
| viewAbilitySeedData | 공개 계약 요소 |
| abilitySeedData | 공개 계약 요소 |
| permissionSummary | 공개 계약 요소 |

## 규칙

- static FULL_ACCESS seed는 legacy/custom ability 정의를 유지합니다.
- static FULL_ACCESS seed는 최상단에 `manage all` 을 포함해 새 권한이 생겨도 즉시 전역 권한을 가집니다.
- admin menu/page FULL_ACCESS grant는 `admin-permissions.ts` 에서 공용 catalog 기반으로 파생합니다.
- 동일한 `subject + actionName + inverted` 조합이 static 영역에 있어도 derived admin grant를 우선 사용합니다.
- page access는 `access page:*`, menu visibility는 `manage menu:*` 로 자동 부여됩니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-06 | FULL_ACCESS의 `manage all` 기본 grant 추가를 반영 | codex |
| 2026-04-06 | FULL_ACCESS가 `manage all` 을 기본으로 가져야 한다는 규칙을 문서화 | codex |
| 2026-04-06 | FULL_ACCESS menu/page grant를 공용 admin permission catalog 기반 파생 구조로 정리 | codex |
| 2026-03-26 | 누락된 sidecar spec 신규 생성 | codex |
