# storybookCodexBridge.test.js Spec

## 목적
- Storybook Codex bridge의 allowlist, branch naming, git status 검증, prompt 생성 규칙이 회귀 없이 유지되는지 확인합니다.

## 핵심 동작
- 허용 prefix의 `.spec.md`만 편집 대상으로 통과시키는지 검증합니다.
- draft PR branch naming이 `docs/storybook-codex/<slug>-<timestamp>` 패턴을 따르는지 검증합니다.
- `git status --porcelain` 출력에서 allowlist 밖 변경과 비허용 변경을 구분하는지 검증합니다.
- Codex 실행 프롬프트가 spec-only 규칙과 변경 이력 업데이트 지시를 포함하는지 검증합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-15 | Storybook Codex bridge helper 회귀 테스트 신규 추가 | codex |
