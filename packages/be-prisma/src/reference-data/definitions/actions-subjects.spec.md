# actions-subjects util 기획서

> 생성일: 2026-03-26
> 타입: util
> 위치: packages/be-prisma/src/reference-data/definitions/actions-subjects.ts

## 역할

이 파일은 util 성격의 경량 구성/배럴 책임을 가집니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| ActionConfigSeedData | 공개 계약 요소 |
| ActionSeedData | 공개 계약 요소 |
| actionSeedData | 공개 계약 요소 |
| SubjectSeedData | 공개 계약 요소 |
| subjectSeedData | 공개 계약 요소 |

## 규칙

- static subject seed는 entity/all/non-admin custom subject의 기본 정의만 유지합니다.
- admin menu/page subject는 `admin-permissions.ts` 에서 공용 catalog 기반으로만 파생합니다.
- legacy admin menu subject는 static seed에 남기지 않고 migration에서 별도로 prune합니다.
- `SubjectSeedData.group` 은 `page` 그룹을 포함해 화면 접근 권한도 reference-data에서 관리합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-06 | static subject seed에서 legacy/current admin menu 직접 선언을 제거하고 shared catalog 파생만 유지하도록 정리 | codex |
| 2026-04-06 | 공용 admin permission catalog에서 파생한 menu/page subject를 reference-data에 합치는 규칙을 반영 | codex |
| 2026-03-26 | 누락된 sidecar spec 신규 생성 | codex |
