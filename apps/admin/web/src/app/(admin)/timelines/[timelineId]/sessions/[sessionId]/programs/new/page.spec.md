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

## 실행 원장

> 이 표의 작업 상태는 프로젝트 실행 기록이며 Codex 런타임 상태와 별도로 판정합니다.

| 단계 | owner | 목표 | 입력과 근거 | 수정 범위 | 산출물 | 선행 단계 | 완료 기준 | 작업 상태 | 검증 근거 |
|---|---|---|---|---|---|---|---|---|---|
| ID-BE | be-controller-builder | decimal timeline API 계약 | apps/admin/web/src/app/(admin)/timelines/[timelineId]/sessions/[sessionId]/programs/new/page.spec.md | timeline backend | decimal timeline API 계약 | - | invalid ID 400 | 대기 | - |
| ID-CODEGEN | common-type-builder | string API client | apps/admin/web/src/app/(admin)/timelines/[timelineId]/sessions/[sessionId]/programs/new/page.spec.md | `packages/fe-api/src/**` | string API client | - | ID type `string` | 대기 | - |
| ID-WEB | fe-route-agent | create form/picker ID 전환 | apps/admin/web/src/app/(admin)/timelines/[timelineId]/sessions/[sessionId]/programs/new/page.spec.md | 이 route와 form | create form/picker ID 전환 | - | create unit/E2E 통과 | 대기 | - |

| 검증 항목 | 명령 | 검증 `agent_type` | 통과 기준 |
|---|---|---|---|
| BIGINT number 변환 금지 | `rg 'Number\(.*Id|parseInt\(.*Id' apps/admin/web packages/fe-*` | `fe-route-agent` | 0건 |
| legacy seq 금지 | `rg '\b[A-Za-z]+Seq\b|_seq' packages apps` | 각 변경 owner | 0건 |
