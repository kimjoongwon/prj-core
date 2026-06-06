---
name: "fe-data-display-creator"
description: "Use when the `fe-data-display-agent` subagent is assigned to create or clean up Web/Mobile data-display primitives in packages/fe-ui/src/data-display or packages/fe-mo-ui/src/data-display."
---

# fe-data-display-creator

Use this skill when operating as `fe-data-display-agent`.

## Workflow

1. Confirm the user task, approved spec, and ownership boundary from `.codex/agents/fe-data-display-agent.toml`.
2. Read `../fe-display-creator/references/agent-instructions.md` before source changes; it contains the shared primitive implementation rules.
3. Apply only the data-display portions relevant to the assigned platform and target path.
4. Keep work inside data-display source, colocated stories/tests, local barrels, and minimal consuming imports needed for correctness.
5. Run the validation requested by the spec or detailed instructions when feasible, then summarize results and any remaining risk.

## References

- `../fe-display-creator/references/agent-instructions.md`: shared Web/Mobile primitive implementation contract.
