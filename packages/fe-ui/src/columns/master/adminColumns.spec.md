# master/adminColumns 기획서

> 생성일: 2026-03-27
> 타입: ui-support
> 위치: packages/fe-ui/src/columns/master/adminColumns.tsx

## 역할

관리자 화면에서 사용하는 master table 컬럼 조합을 도메인별로 제공합니다.
이 파일은 Action, Role, Ability, User, Subject, Task, Timeline, Template, Space, Routine, Asset, Inquiry 컬럼 빌딩 흐름만 보여주고 공용 helper는 factory 계층에 위임합니다.

## 공개 계약

| 항목                        | 설명                       |
| --------------------------- | -------------------------- |
| `buildActionTableColumns` | Action 목록 컬럼 builder |
| `actionTableColumns` | Action 목록 컬럼 조합 |
| `buildSubjectTableColumns` | Subject 목록 컬럼 builder |
| `buildAdminRoleTableColumns` | 역할 목록 generic builder |
| `adminRoleTableColumns` | 역할 목록 컬럼 조합 |
| `buildAbilityListTableColumns` | 권한 목록 컬럼 builder |
| `buildUserListTableColumns` | User 목록 컬럼 builder |
| `subjectTableColumns` | Subject 목록 컬럼 조합 |
| `buildTaskTableColumns` | Task 목록 컬럼 builder |
| `buildTimelineTableColumns` | Timeline 목록 컬럼 builder |
| `buildTemplateTableColumns` | Template 목록 컬럼 builder |
| `buildSpaceTableColumns` | Space 목록 컬럼 builder |
| `buildRoutineTableColumns` | Routine 목록 컬럼 builder |
| `buildAssetTableColumns` | Asset 목록 컬럼 builder |
| `buildInquiryTableColumns` | Inquiry 목록 컬럼 builder |

## 변경 이력

| 일자       | 내용                                                                                                                                | 작성자 |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------ |
| 2026-03-29 | `Role/Routine/Task/Template/Timeline` 목록 컬럼을 generic row + callback 계약으로 정리해 pure page가 API DTO 없이 columns를 재사용할 수 있게 정리 | codex  |
| 2026-03-29 | `Subject` 목록 컬럼을 generic builder로 추출해 pure page가 API DTO 없이도 동일한 columns 조합을 재사용할 수 있게 정리 | codex  |
| 2026-03-29 | `Action` 목록 컬럼을 generic builder로 추출해 pure page가 API DTO 없이도 동일한 columns 조합을 재사용할 수 있게 정리 | codex  |
| 2026-03-28 | `columns/raw` 제거를 위해 역할/권한 목록 컬럼을 `master/adminColumns`로 흡수하고 `MetaDataGrid` 기준 공개 계약으로 통합 | codex  |
| 2026-03-28 | admin column builder 주석을 영문에서 한글로 정리하고 컬럼 조합 함수 설명을 보강 | codex  |
| 2026-03-28 | 주요 admin column builder 함수에 의도 설명 주석을 추가해 callback 주입과 cell 위임 구조를 문서화 | codex  |
| 2026-03-28 | 관리자 master columns의 인라인 버튼/텍스트/Chip 마크업을 `src/cell` 컴포넌트 조합으로 치환 | codex  |
| 2026-03-27 | builder 내부의 지역 column 변수 선언을 줄이고 최종 `buildColumns(...)` 조립 시점에 공용 factory를 직접 호출하도록 단순화            | codex  |
| 2026-03-27 | Action/Subject 식별자, 가입일/접수일, 반복 text column을 semantic preset helper로 치환해 도메인 파일 문자열과 label override를 축소 | codex  |
| 2026-03-27 | 셀 전용 primitive import를 이동된 루트 `src/cell` 배럴로 통일                                                                       | codex  |
| 2026-03-27 | 관리자 영역 master columns를 도메인 파일로 분리하고 exported custom row type 선언을 제거                                            | codex  |
