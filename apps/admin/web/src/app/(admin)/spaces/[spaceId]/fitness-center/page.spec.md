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
