---
name: "fe-display-creator"
description: "Shared legacy Web/Mobile primitive reference for split display-area creator skills. Prefer `fe-data-display-creator`, `fe-feedback-creator`, or `fe-overlay-creator` for new subagent assignments."
---

# fe-display-creator

Use this skill only as a shared reference for split display-area creator workflows, or when a task explicitly asks for this legacy workflow.

## Workflow

1. Confirm the user task, approved spec, and ownership boundary from the assigned split subagent TOML.
2. Read `references/agent-instructions.md` before source changes; it contains the detailed implementation rules for this creator.
3. Apply only the sections relevant to the assigned target. For platform-aware FE creators, choose the target platform from file paths before applying Web or React Native rules.
4. Keep work inside the subsubagent ownership boundary. If another subagent owns the needed file or sequence, stop and summarize the handoff need in the final report.
5. Run the validation requested by the spec or detailed instructions when feasible, then summarize results and any remaining risk.

## References

- `references/agent-instructions.md`: detailed workflow and implementation contract migrated from the original subagent TOML.
