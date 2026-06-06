---
name: "qa-mo-testing-creator"
description: "Use when the `qa-mo-testing` agent_type is assigned to Jest + React Native Testing Library 기반 모바일 단위 테스트 코드를 작성하는 전문가. This creator skill contains the detailed workflow, implementation rules, and validation contract moved out of the thin subagent TOML."
---

# qa-mo-testing-creator

Use this skill when operating as `qa-mo-testing` or when a task explicitly asks for this creator workflow.

## Workflow

1. Confirm the user task, approved spec, and ownership boundary from `.codex/agents/qa-mo-testing.toml`.
2. Read `references/agent-instructions.md` before source changes; it contains the detailed implementation rules for this creator.
3. Apply only the sections relevant to the assigned target. For platform-aware FE creators, choose the target platform from file paths before applying Web or React Native rules.
4. Keep work inside the subagent ownership boundary. If another subagent owns the needed file or sequence, stop and summarize the handoff need in the final report.
5. Run the validation requested by the spec or detailed instructions when feasible, then summarize results and any remaining risk.

## References

- `references/agent-instructions.md`: detailed workflow and implementation contract migrated from the original subagent TOML.
