# Space Fitness Center Edit Route

## Route / Screen Mapping

- page 역할: form
- reusable 대상: form
- screen component path: packages/fe-ui/src/screen/FitnessCenterEditScreen/FitnessCenterEditScreen.tsx
- SSR/prefetch 예외 승인 여부: 없음

## State Contract

- route는 `FitnessCenterFormState` class를 `useLocalObservable(() => new FitnessCenterFormState())`로 생성한다.
- API 응답 `FitnessCenterDto`는 `FitnessCenterFormState.setFromDto`로 폼 상태에 반영한다.
- submit payload는 `FitnessCenterFormState.validate()`와 `FitnessCenterFormState.toUpdateDto()`를 통해 생성한다.

## 식별자 계약 리팩터링

- 디자인 정렬: `no UI design impact`. form layout과 상태 표현은 유지합니다.
- `[spaceId]`, relation `companyId`, `spaceId`는 DB `BIGINT id`의 양수 십진 문자열입니다. 모델별 ULID는 integration 전용입니다.
- backend는 Controller에서 `bigint`로 변환하고, generated client와 form state는 `string`을 유지합니다.

| 단계 id | 담당 `agent_type` | 예상 산출물 | 생성/수정 예정 경로 | 소비 단계 | 검증 기준 |
|---|---|---|---|---|---|
| ID-BE | `be-controller-builder` | decimal route/request 계약 | backend ID consumer | ID-CODEGEN | invalid ID 400 |
| ID-CODEGEN | `common-type-builder` | string API client | `packages/fe-api/src/**` | ID-WEB | ID type `string` |
| ID-WEB | `fe-route-agent` | route/form ID 전환 | 이 route와 form state | none-final | edit E2E 통과 |

| 검증 항목 | 명령 | 검증 `agent_type` | 통과 기준 |
|---|---|---|---|
| legacy seq 금지 | `rg '\b[A-Za-z]+Seq\b|_seq' packages apps` | 각 변경 owner | 0건 |
| BIGINT number 변환 금지 | `rg 'Number\(.*Id|parseInt\(.*Id' apps/admin/web packages/fe-*` | `fe-route-agent` | 0건 |
