# storybookCodexBridge.js Spec

## 목적
- Storybook dev 서버 안에 local-only Codex bridge endpoint를 올려 현재 page story에 연결된 spec 수정 제안과 draft PR 발행을 처리합니다.

## 핵심 동작
- `/__codex/capabilities`에서 `codex`, `gh`, `gh auth`, `origin` remote 상태를 확인해 bridge 사용 가능 여부를 반환합니다.
- `/__codex/jobs`는 현재 story에 연결된 `.spec.md` allowlist만 받아 temp git worktree에서 `codex exec`를 실행합니다.
- Codex 실행 뒤에는 `git status --porcelain`로 changed files를 검사해 allowlist 밖 파일, rename, delete, untracked 파일이 있으면 결과를 차단합니다.
- 허용된 spec 변경만 남으면 job 결과로 summary, touched files, 실행 로그를 보존합니다.
- `/__codex/jobs/:id/publish-pr`는 `main` 대상 draft PR만 생성하며, 직접 main에 반영하지 않습니다.
- publish 단계는 새 branch 생성, commit, push, `gh pr create --draft --base main` 순으로 동작합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| `createStorybookCodexBridgePlugin()` | Storybook Vite dev 서버에 `/__codex/*` middleware를 등록합니다. |
| `sanitizeCodexTargetFile()` | 허용된 spec 경로만 통과시킵니다. |
| `createCodexBranchName()` | Storybook Codex 제안용 branch 이름을 생성합니다. |
| `collectAllowedJobChanges()` | worktree 변경을 allowlist 기준으로 검증합니다. |
| `buildCodexExecutionPrompt()` | Codex에게 전달할 spec-only 편집 프롬프트를 구성합니다. |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-15 | Storybook page planning에서 spec 수정 제안을 실행하고 draft PR까지 발행하는 local Codex bridge 신규 추가 | codex |
