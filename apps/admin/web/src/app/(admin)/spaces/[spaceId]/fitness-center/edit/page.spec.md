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
