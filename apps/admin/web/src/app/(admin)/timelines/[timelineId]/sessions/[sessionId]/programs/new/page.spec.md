# Timeline Session Program Create Page

## Route / Screen Mapping

- page 역할: form
- reusable 대상: form
- screen component path: packages/fe-ui/src/screen/TimelineSessionProgramEditScreen/TimelineSessionProgramEditScreen.tsx
- SSR/prefetch 예외 승인 여부: 없음

## 상태 / Modal 계약

- route는 Program payload form state와 API wiring만 소유합니다.
- Picker 후보 조회와 검색 상태는 `domain/program/ProgramPicker`가 자체 API로 소유합니다.
- `TimelineSessionProgramForm`이 `ProgramPickerState`를 만들고 `app.modal.open()`을 호출합니다.

## 식별자 계약 리팩터링

- 디자인 정렬: `no UI design impact`. create form과 picker UI는 유지합니다.
- `[timelineId]`, `[sessionId]`, `routineId`, `instructorId`는 DB `BIGINT id`의 양수 십진 문자열입니다.
- generated client와 form state는 ID를 `string`으로 보존하고 모델별 ULID는 integration 전용입니다.

| 단계 id | 담당 `agent_type` | 예상 산출물 | 생성/수정 예정 경로 | 소비 단계 | 검증 기준 |
|---|---|---|---|---|---|
| ID-BE | `be-controller-builder` | decimal timeline API 계약 | timeline backend | ID-CODEGEN | invalid ID 400 |
| ID-CODEGEN | `common-type-builder` | string API client | `packages/fe-api/src/**` | ID-WEB | ID type `string` |
| ID-WEB | `fe-route-agent` | create form/picker ID 전환 | 이 route와 form | none-final | create unit/E2E 통과 |

| 검증 항목 | 명령 | 검증 `agent_type` | 통과 기준 |
|---|---|---|---|
| BIGINT number 변환 금지 | `rg 'Number\(.*Id|parseInt\(.*Id' apps/admin/web packages/fe-*` | `fe-route-agent` | 0건 |
| legacy seq 금지 | `rg '\b[A-Za-z]+Seq\b|_seq' packages apps` | 각 변경 owner | 0건 |
