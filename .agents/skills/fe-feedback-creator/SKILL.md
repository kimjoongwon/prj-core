---
name: "fe-feedback-creator"
description: "Use when the `fe-feedback-agent` subagent is assigned to create or clean up Web/Mobile feedback and status primitives in packages/fe-ui/src/feedback or packages/fe-mo-ui/src/feedback."
---

# fe-feedback-creator

Use this skill when operating as `fe-feedback-agent`.

## Workflow

1. Confirm the user task, approved spec, and ownership boundary from `.codex/agents/fe-feedback-agent.toml`.
2. Read `../fe-display-creator/references/agent-instructions.md` before source changes; it contains the shared primitive implementation rules.
3. Apply only the feedback/status portions relevant to the assigned platform and target path.
4. Keep work inside feedback source, colocated stories/tests, local barrels, and minimal consuming imports needed for correctness.
5. Run the validation requested by the spec or detailed instructions when feasible, then summarize results and any remaining risk.

## References

- `../fe-display-creator/references/agent-instructions.md`: shared Web/Mobile primitive implementation contract.
