# Space Ground Edit Route

## Route / Screen Mapping

- page 역할: form
- reusable 대상: form
- screen component path: packages/fe-ui/src/screen/GroundEditScreen/GroundEditScreen.tsx
- SSR/prefetch 예외 승인 여부: 없음

## State Contract

- route는 `GroundFormState` class를 `useLocalObservable(() => new GroundFormState())`로 생성한다.
- API 응답 `GroundDto`는 `GroundFormState.setFromDto`로 폼 상태에 반영한다.
- submit payload는 `GroundFormState.validate()`와 `GroundFormState.toUpdateDto()`를 통해 생성한다.
