# IdpErrorPage.stories.tsx Spec

## 목적
- `page/IdpErrorPage`에서 OIDC 오류 카드의 상세 메시지 유무에 따른 상태를 실제 UI로 확인합니다.
- scaffold 대신 인증 오류 복구 흐름을 Storybook canvas에서 바로 검토할 수 있게 합니다.

## 핵심 동작
- Storybook 사이드바 제목은 `page/IdpErrorPage`입니다.
- 스토리 파일 기준 경로는 `page/IdpErrorPage/IdpErrorPage.stories.tsx`입니다.
- `Default`, `WithoutDescription` 시나리오를 제공합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-14 | scaffold를 실제 IDP 오류 카드 시나리오 스토리로 교체 | Codex |
| 2026-04-05 | 누락된 page Storybook scaffold 신규 생성 | Codex |
