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

## 실행 원장

> 이 표의 작업 상태는 프로젝트 실행 기록이며 Codex 런타임 상태와 별도로 판정합니다.

| 단계 | owner | 목표 | 입력과 근거 | 수정 범위 | 산출물 | 선행 단계 | 완료 기준 | 작업 상태 | 검증 근거 |
|---|---|---|---|---|---|---|---|---|---|
| ID-BE | be-controller-builder | decimal route/response 계약 | apps/admin/web/src/app/(admin)/spaces/[spaceId]/fitness-center/page.spec.md | backend ID consumer | decimal route/response 계약 | - | invalid ID 400 | 대기 | - |
| ID-CODEGEN | common-type-builder | string API client | apps/admin/web/src/app/(admin)/spaces/[spaceId]/fitness-center/page.spec.md | `packages/fe-api/src/**` | string API client | - | ID type `string` | 대기 | - |
| ID-WEB | fe-route-agent | detail route ID 전환 | apps/admin/web/src/app/(admin)/spaces/[spaceId]/fitness-center/page.spec.md | 이 route | detail route ID 전환 | - | detail E2E 통과 | 대기 | - |

| 검증 항목 | 명령 | 검증 `agent_type` | 통과 기준 |
|---|---|---|---|
| legacy seq 금지 | `rg '\b[A-Za-z]+Seq\b|_seq' packages apps` | 각 변경 owner | 0건 |
