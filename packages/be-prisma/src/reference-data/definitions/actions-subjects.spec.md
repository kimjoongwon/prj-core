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

- static subject seed는 entity/all/custom subject의 기본 정의를 유지합니다.
- admin menu/page subject는 `admin-permissions.ts` 에서 공용 catalog 기반으로 파생한 뒤 static seed와 합쳐집니다.
- 동일한 admin subject 이름이 static 영역에도 존재하면 derived subject를 우선 사용합니다.
- `SubjectSeedData.group` 은 `page` 그룹을 포함해 화면 접근 권한도 reference-data에서 관리합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-06 | 공용 admin permission catalog에서 파생한 menu/page subject를 reference-data에 합치는 규칙을 반영 | codex |
| 2026-03-26 | 누락된 sidecar spec 신규 생성 | codex |
