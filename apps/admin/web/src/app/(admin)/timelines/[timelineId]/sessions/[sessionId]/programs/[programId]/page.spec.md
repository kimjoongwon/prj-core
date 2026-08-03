# Timeline Session Program Detail Page

## Route / Screen Mapping

- page 역할: detail
- reusable 대상: detail/view
- screen component path: packages/fe-ui/src/screen/TimelineSessionProgramEditScreen/TimelineSessionProgramEditScreen.tsx
- SSR/prefetch 예외 승인 여부: 없음

## 상태 / Modal 계약

- route는 저장된 Program을 readOnly form state로 변환합니다.
- readOnly state에는 Modal 검색어와 open 상태를 포함하지 않습니다.
- ProgramPicker는 detail 화면에서 열리지 않습니다.

## 식별자 계약 리팩터링

- 디자인 정렬: `no UI design impact`. readOnly detail UI는 유지합니다.
- 모든 route/relation ID는 DB `BIGINT id`의 양수 십진 문자열이고 모델별 ULID는 일반 REST 응답에서 제외합니다.

| 단계 id | 담당 `agent_type` | 예상 산출물 | 생성/수정 예정 경로 | 소비 단계 | 검증 기준 |
|---|---|---|---|---|---|
| ID-BE | `be-controller-builder` | decimal timeline API 계약 | timeline backend | ID-CODEGEN | invalid ID 400 |
| ID-CODEGEN | `common-type-builder` | string API client | `packages/fe-api/src/**` | ID-WEB | ID type `string` |
| ID-WEB | `fe-route-agent` | detail ID 전환 | 이 route | none-final | detail E2E 통과 |

| 검증 항목 | 명령 | 검증 `agent_type` | 통과 기준 |
|---|---|---|---|
| legacy seq 금지 | `rg '\b[A-Za-z]+Seq\b|_seq' packages apps` | 각 변경 owner | 0건 |
