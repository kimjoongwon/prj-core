# Admin Root Page / Layout Spec

## Route / Screen Mapping

- page 역할: detail
- reusable 대상: detail/view
- screen component path: packages/fe-ui/src/screen/SessionCheckScreen/SessionCheckScreen.tsx
- SSR/prefetch 예외 승인 여부: 없음

## 서버 Skeleton

- root `layout.tsx`가 `Providers > App`을 조립합니다.
- `App.GlobalLayer`에는 `AppModalHost`를 한 번만 마운트합니다.
- 인증 이후 `(admin)/layout.tsx`는 `Admin.Header`, `Admin.Body`, `Admin.LeftAside`, `Admin.Main`, `Admin.Footer`를 조립합니다.

## Page 조합

- `App.Content`에 auth/admin route branch를 렌더링합니다.
- `/` page는 `SessionCheckScreen`으로 인증 확인 상태를 표시합니다.
- admin branch는 header의 장식 없는 Plate mark·wordmark와 utility, navigation, guarded content, sidebar·main 축에 맞춘 낮은 강조도의 copyright footer를 공통으로 제공합니다.

## Surface 소유권

- root layout은 surface를 소유하지 않습니다.
- 각 screen이 자신의 screen/section surface를 소유합니다.

## Slot 구조

- `children` 단일 implicit slot을 사용합니다.
- named slot은 사용하지 않습니다.

## Slot URL 매핑

- named slot이 없으므로 별도 URL 매핑이 없습니다.

## Slot 대체 처리

- named slot이 없으므로 `default.tsx` 대체 처리가 필요하지 않습니다.

## 독립 Navigation 정책

- admin navigation은 `(admin)/layout.tsx`가 소유합니다.
- Plate 브랜드 링크는 `/dashboard`를 가리키고 navigation과 독립적으로 관리자 홈 이동을 제공합니다.
- Modal은 URL segment가 아니며 route 전환 시 `ModalStore.dismiss()`로 정리합니다.

## Child Content 계약

- child page는 `App`이나 전역 Modal host를 다시 만들지 않습니다.
- Modal content는 `app.modal.open({ title, state, content })`로 요청합니다.

## 식별자 계약 리팩터링

- 디자인 정렬: `no UI design impact`. shell, navigation, modal 구조는 그대로 유지합니다.
- 공통 데이터 계약: route segment와 navigation target의 `*Id`는 DB `BIGINT id`의 양수 십진 문자열이며 `number`로 변환하지 않습니다.
- 모델별 ULID는 일반 page props와 UI API 응답에서 제외하고 integration 계약만 소유합니다.

| 단계 id | 담당 `agent_type` | 예상 산출물 | 생성/수정 예정 경로 | 소비 단계 | 검증 기준 |
|---|---|---|---|---|---|
| ID-CODEGEN | `common-type-builder` | string ID API client | `packages/fe-api/src/**` | ID-WEB | generated ID type `string` |
| ID-WEB | `fe-route-agent` | navigation/query ID 전환 | `apps/admin/web/src/app/**` | none-final | dynamic route E2E 통과 |

| 검증 항목 | 명령 | 검증 `agent_type` | 통과 기준 |
|---|---|---|---|
| 숫자 변환 금지 | `rg 'Number\(.*Id|parseInt\(.*Id' apps/admin/web packages/fe-*` | `fe-route-agent` | BIGINT ID 변환 0건 |
| legacy seq 금지 | `rg '\b(seq|[A-Za-z]+Seq)\b|_seq' packages apps` | 각 변경 owner | 식별자 계약 잔존 0건 |
