# Storybook Runtime Policy

## 기본 원칙

- Storybook의 기본 API 실행 방식은 MSW이다.
- Storybook은 `plate_e2e` 또는 실제 개발 DB에 직접 의존하지 않는다.
- 실제 API, DB, 인증, 권한, transaction 검증은 E2E 테스트에서 수행한다.
- Screen/Feature story는 기획 상태를 `PlanningScenario` 속성으로 선언한다.
- Web Storybook은 `PlanningScenario.api.handlers`를 MSW handler로 실행한다.
- Expo Web Storybook도 같은 `PlanningScenario` 계약을 MSW로 실행한다.
- Native Mobile Storybook은 같은 `PlanningScenario` 계약을 native mock transport로 실행한다.
- 순수 UI component story는 props 중심으로 작성할 수 있다.

## 역할 분리

- `PlanningScenario`: Story가 검증하는 기획 속성이다.
- `*.msw.ts`: Storybook에서 사용할 API 응답 시나리오이다.
- `plate_e2e` DB: E2E 전용 실제 시스템 검증 환경이다.

## 금지

- Storybook story가 실제 DB 상태에 의존하지 않는다.
- Storybook story가 실제 로그인, 실제 tenant 선택, 실제 production API를 요구하지 않는다.
- 기획 속성을 런타임에 외부 문서 파일에서 파싱하지 않는다.
