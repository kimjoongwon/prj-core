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
