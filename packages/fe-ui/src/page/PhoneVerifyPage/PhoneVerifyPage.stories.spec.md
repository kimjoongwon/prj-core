# PhoneVerifyPage.stories.tsx Spec

## 목적
- `page/PhoneVerifyPage` 스토리를 통해 전화번호 인증 플로우의 주요 상태를 확인합니다.
- 스토리 파일 구조를 반영한 탐색 경로를 유지합니다.

## 핵심 동작
- Storybook 사이드바 제목은 `page/PhoneVerifyPage`입니다.
- 스토리 파일 기준 경로는 `page/PhoneVerifyPage/PhoneVerifyPage.stories.tsx`입니다.
- 기본 입력 상태, 인증번호 발송 후 상태, 인증 실패 상태를 제공합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-14 | Storybook 9 args 계약에 맞춰 `state` 기본값과 SMS 인증 상태별 override 구성을 정리 | Codex |
| 2026-04-05 | placeholder를 실제 페이지 스토리로 교체하고 SMS 인증 시나리오를 추가 | Codex |
| 2026-03-15 | `Auto/*` title을 실제 스토리 경로 기준으로 정규화하고 sidecar spec을 추가 | codex |
