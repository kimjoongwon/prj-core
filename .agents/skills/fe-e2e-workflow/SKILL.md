---
name: fe-e2e-workflow
description: "Use when working on frontend Playwright E2E in this repo, especially when deciding whether to run tests directly or use the qa-fe-e2e-testing role, handling headed browser runs, stabilizing flaky tests, and reporting results."
metadata:
  short-description: Frontend E2E workflow for this repo
---

# Frontend E2E Workflow

Use this skill for frontend Playwright E2E requests in this repository.

## Decision Rule

1. If the user asks to write, fix, stabilize, or expand FE E2E tests, prefer a `qa-fe-e2e-testing` role `agent`.
2. If the user asks only to run existing FE E2E tests, the main Codex may execute them directly.
3. If a run-only request turns into test editing because of failures or flakiness, switch to a `qa-fe-e2e-testing` role `agent`.

## When To Use Headed Mode

- Use `--headed` when the user explicitly asks to open the browser.
- Prefer `--workers=1` for interactive debugging or when reproducing flaky UI behavior.
- If the scope is narrow, add `--grep` to keep the run targeted.

## Execution Checklist

1. Identify the target app, route, and test files before running.
2. Confirm required local services are running. Start only what the target suite needs.
3. Run the narrowest Playwright command that answers the request.
4. If failures occur, decide whether it is:
   - environment/setup
   - product regression
   - flaky selector/wait issue
   - outdated test expectation
5. If test files change, update the adjacent `*.spec.md` and append `## 변경 이력`.
6. Re-run the affected scope, then the requested scope.
7. Stop ad-hoc services started only for the run.

## Reporting

- State whether the request was handled by the main Codex or by a `qa-fe-e2e-testing` role `agent`.
- Include the exact Playwright command that was run.
- Report pass/fail counts and the key reason for any failure.
- Mention any files changed to stabilize tests.
- Mention whether temporary services were stopped afterward.

## Examples

### Run only

User asks: `e2e 테스트를 브라우저 켜서 실행해줘`

- Main Codex may run the existing suite directly with `--headed`.
- If the suite passes without edits, no `qa-fe-e2e-testing` role `agent` is required.

### Fix or author tests

User asks: `roles 화면 E2E를 고쳐줘`

- Use a `qa-fe-e2e-testing` role `agent`.
- If needed, pair it with existing repo orchestration guidance for FE E2E strategy and execution.
