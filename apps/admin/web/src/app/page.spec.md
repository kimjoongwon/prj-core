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
