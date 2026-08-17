# Storybook Runtime Policy

## 기본 원칙

- Storybook의 기본 API 실행 방식은 MSW이다.
- Storybook은 `plate_e2e` 또는 실제 개발 DB에 직접 의존하지 않는다.
- 실제 API, DB, 인증, 권한, transaction 검증은 E2E 테스트에서 수행한다.
- Screen/Feature story는 기획 상태를 `PlanningScenario` 속성으로 선언한다.
- Web Storybook은 Story의 `parameters.msw.handlers`를 MSW handler로 실행한다.
- Expo Web Storybook도 Story의 `parameters.msw.handlers`를 사용한다.
- Native Mobile Storybook mock은 각 Storybook 런타임의 mock 계약을 사용한다.
- 순수 UI component story는 props 중심으로 작성할 수 있다.
- 기획 프레임 UI는 전역 decorator로 자동 주입하지 않고, story `render`에서 `PlanningPreviewFrame`으로 수동 래핑한다.
- Screen story는 같은 `PlanningScenario` 객체를 `parameters.planning`과 `PlanningPreviewFrame scenario`에 함께 전달한다.
- `PlanningPreviewFrame`의 mock 로그인과 tenant/space 선택은 실제 인증, 라우터, runtime store를 변경하지 않는다.

## 역할 분리

- `PlanningScenario`: Story가 검증하는 기획 속성이다.
- `PlanningPreviewFrame`: Story가 선언한 기획 속성과 화면 preview를 함께 보여주는 수동 래퍼이다.
- `*.msw.ts`: Storybook에서 사용할 API 응답 시나리오이다.
- `plate_e2e` DB: E2E 전용 실제 시스템 검증 환경이다.

## 금지

- Storybook story가 실제 DB 상태에 의존하지 않는다.
- Storybook story가 실제 로그인, 실제 tenant 선택, 실제 production API를 요구하지 않는다.
- 기획 속성을 런타임에 외부 문서 파일에서 파싱하지 않는다.
