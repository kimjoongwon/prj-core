# Space Fitness Center Detail Route

## Route / Screen Mapping

- page 역할: detail
- reusable 대상: form
- screen component path: packages/fe-ui/src/screen/FitnessCenterEditScreen/FitnessCenterEditScreen.tsx
- SSR/prefetch 예외 승인 여부: 없음

## State Contract

- route는 `FitnessCenterFormState` class를 `useLocalObservable(() => new FitnessCenterFormState())`로 생성한다.
- API 응답 `FitnessCenterDto`는 `FitnessCenterFormState.setFromDto`로 폼 상태에 반영한다.
- 상세 모드는 route가 `readOnly`로 결정한다.

## 식별자 계약 리팩터링

- 디자인 정렬: `no UI design impact`. detail layout과 readOnly 상태는 유지합니다.
- `[spaceId]`와 응답 관계 ID는 DB `BIGINT id`의 양수 십진 문자열이며 모델별 ULID는 일반 REST 응답에 포함하지 않습니다.

| 단계 id | 담당 `agent_type` | 예상 산출물 | 생성/수정 예정 경로 | 소비 단계 | 검증 기준 |
|---|---|---|---|---|---|
| ID-BE | `be-controller-builder` | decimal route/response 계약 | backend ID consumer | ID-CODEGEN | invalid ID 400 |
| ID-CODEGEN | `common-type-builder` | string API client | `packages/fe-api/src/**` | ID-WEB | ID type `string` |
| ID-WEB | `fe-route-agent` | detail route ID 전환 | 이 route | none-final | detail E2E 통과 |

| 검증 항목 | 명령 | 검증 `agent_type` | 통과 기준 |
|---|---|---|---|
| legacy seq 금지 | `rg '\b[A-Za-z]+Seq\b|_seq' packages apps` | 각 변경 owner | 0건 |
