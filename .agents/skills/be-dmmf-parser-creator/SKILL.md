---
name: "be-dmmf-parser-creator"
description: "Use when the `be-dmmf-parser-builder` agent_type is assigned to Prisma DMMF 파싱 유틸리티를 생성하는 전문가. This creator skill contains the detailed workflow, implementation rules, and validation contract moved out of the thin subagent TOML."
---

# be-dmmf-parser-creator

Use this skill when operating as `be-dmmf-parser-builder` or when a task explicitly asks for this creator workflow.

## Workflow

1. Confirm the user task, approved spec, and ownership boundary from `.codex/agents/be-dmmf-parser-builder.toml`.
2. Read `references/agent-instructions.md` before source changes; it contains the detailed implementation rules for this creator.
3. Apply only the sections relevant to the assigned target. For platform-aware FE creators, choose the target platform from file paths before applying Web or React Native rules.
4. Keep work inside the subagent ownership boundary. If another subagent owns the needed file or sequence, stop and summarize the handoff need in the final report.
5. Run the validation requested by the spec or detailed instructions when feasible, then summarize results and any remaining risk.

## References

- `references/agent-instructions.md`: detailed workflow and implementation contract migrated from the original subagent TOML.
