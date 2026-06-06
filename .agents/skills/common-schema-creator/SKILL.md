---
name: "common-schema-creator"
description: "Use when the `common-schema-builder` agent_type is assigned to 프론트엔드와 백엔드에서 공유하는 검증 스키마를 생성하는 전문가 (다국어 검증 메시지 포함). This creator skill contains the detailed workflow, implementation rules, and validation contract moved out of the thin subagent TOML."
---

# common-schema-creator

Use this skill when operating as `common-schema-builder` or when a task explicitly asks for this creator workflow.

## Workflow

1. Confirm the user task, approved spec, and ownership boundary from `.codex/agents/common-schema-builder.toml`.
2. Read `references/agent-instructions.md` before source changes; it contains the detailed implementation rules for this creator.
3. Apply only the sections relevant to the assigned target. For platform-aware FE creators, choose the target platform from file paths before applying Web or React Native rules.
4. Keep work inside the subagent ownership boundary. If another subagent owns the needed file or sequence, stop and summarize the handoff need in the final report.
5. Run the validation requested by the spec or detailed instructions when feasible, then summarize results and any remaining risk.

## References

- `references/agent-instructions.md`: detailed workflow and implementation contract migrated from the original subagent TOML.
