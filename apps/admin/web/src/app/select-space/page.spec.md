# Select Space Page Spec

## Route / Screen Mapping

- page 역할: form
- reusable 대상: form
- screen component path: packages/fe-ui/src/screen/AccountTenantSelectScreen/AccountTenantSelectScreen.tsx
- SSR/prefetch 예외 승인 여부: 없음

## Page 조합

- `/select-space`는 로그인했지만 현재 tenant가 확정되지 않은 account가 진입합니다.
- route page는 `AccountTenantSelectScreen`에 정적 안내 문구만 전달합니다.
- tenant 조회, 선택 저장, pending/empty 처리는 screen이 조합하는 `AccountTenantSelect`가 자체 소유합니다.

## Navigation

- `AccountBootstrapper`는 인증된 account에 현재 tenant가 없으면 이 route로 이동시킵니다.
- tenant 선택이 account에 반영되면 `AccountBootstrapper`가 `/dashboard`로 이동시킵니다.

## Surface 소유권

- route page는 시각 surface를 소유하지 않습니다.
- viewport와 선택 카드의 surface는 `AccountTenantSelectScreen`이 소유합니다.

## 식별자 계약 리팩터링

- 디자인 정렬: `no UI design impact`. 선택 화면의 정보 구조와 상호작용은 유지하고 식별자 wire type만 변경합니다.
- route/API 계약: `tenantId`, `spaceId`는 DB `BIGINT id`를 나타내는 양수 십진 문자열이며, 모델별 ULID는 integration 경계에서만 사용합니다.
- frontend 계약: store, query key, `x-tenant-id`는 십진 문자열을 그대로 보존하고 `number`로 변환하지 않습니다.

| 단계 id | 담당 `agent_type` | 예상 산출물 | 생성/수정 예정 경로 | 소비 단계 | 검증 기준 |
|---|---|---|---|---|---|
| ID-BE | `be-controller-builder` | decimal string API 계약 | `packages/be-controller/src/**`, `packages/be-dto/src/**` | ID-CODEGEN | invalid ID 400 |
| ID-CODEGEN | `common-type-builder` | string ID API client | `packages/fe-api/src/**` | ID-WEB | generated ID type `string` |
| ID-WEB | `fe-route-agent` | tenant 선택 ID 전환 | 이 route와 관련 store/hook | none-final | 선택/복구 E2E 통과 |

| 검증 항목 | 명령 | 검증 `agent_type` | 통과 기준 |
|---|---|---|---|
| legacy seq 금지 | `rg '\b(seq|[A-Za-z]+Seq)\b|_seq' packages apps` | 각 변경 owner | 식별자 계약 잔존 0건 |
| ULID route 검증 금지 | `rg 'ParseUlidPipe' packages/be-controller/src` | `be-controller-builder` | protocol/integration endpoint만 남음 |
