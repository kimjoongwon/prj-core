---
name: "fe-form-creator"
description: "Use when the `fe-form-agent` agent_type is assigned to 생성/수정 입력 화면용 재사용 form 계층을 생성하고 정리하는 전문가. This creator skill contains the detailed workflow, implementation rules, and validation contract moved out of the thin subagent TOML."
---

# fe-form-creator

Use this skill when operating as `fe-form-agent` or when a task explicitly asks for this creator workflow.

## Workflow

1. Confirm the user task, approved spec, and ownership boundary from `.codex/agents/fe-form-agent.toml`.
2. Read `references/agent-instructions.md` before source changes; it contains the detailed implementation rules for this creator.
3. Apply only the sections relevant to the assigned target. For platform-aware FE creators, choose the target platform from file paths before applying Web or React Native rules.
4. Keep work inside the subagent ownership boundary. If another subagent owns the needed file or sequence, stop and summarize the handoff need in the final report.
5. Run the validation requested by the spec or detailed instructions when feasible, then summarize results and any remaining risk.

## References

- `references/agent-instructions.md`: detailed workflow and implementation contract migrated from the original subagent TOML.
