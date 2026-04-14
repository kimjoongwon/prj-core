# IdpInteractionPage.stories.tsx Spec

## 목적
- `page/IdpInteractionPage`에서 interaction loading, login, consent, expired 상태를 실제 인증 카드 UI로 확인합니다.
- scaffold 대신 OIDC interaction 분기 화면을 Storybook canvas에서 바로 검토할 수 있게 합니다.

## 핵심 동작
- Storybook 사이드바 제목은 `page/IdpInteractionPage`입니다.
- 스토리 파일 기준 경로는 `page/IdpInteractionPage/IdpInteractionPage.stories.tsx`입니다.
- `Loading`, `Login`, `Consent`, `ExpiredInteraction` 시나리오를 제공합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-14 | scaffold를 실제 OIDC interaction 상태별 스토리로 교체 | Codex |
| 2026-04-05 | 누락된 page Storybook scaffold 신규 생성 | Codex |
