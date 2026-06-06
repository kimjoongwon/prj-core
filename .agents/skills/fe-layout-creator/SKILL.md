---
name: "fe-layout-creator"
description: "Use when the `fe-layout-agent` subagent is assigned to create or clean up Web/Mobile layout primitives in packages/fe-ui/src/layout or packages/fe-mo-ui/src/layout."
---

# fe-layout-creator

Use this skill when operating as `fe-layout-agent` or when a task explicitly asks for this creator workflow.

## Workflow

1. Confirm the user task, approved spec, and ownership boundary from `.codex/agents/fe-layout-agent.toml`.
2. Read `references/agent-instructions.md` before source changes; it contains the detailed implementation rules for this creator.
3. Apply only the sections relevant to the assigned target. For platform-aware FE creators, choose the target platform from file paths before applying Web or React Native rules.
4. Keep work inside the subagent ownership boundary. If another subagent owns the needed file or sequence, stop and summarize the handoff need in the final report.
5. Run the validation requested by the spec or detailed instructions when feasible, then summarize results and any remaining risk.

## References

- `references/agent-instructions.md`: detailed workflow and implementation contract migrated from the original subagent TOML.
