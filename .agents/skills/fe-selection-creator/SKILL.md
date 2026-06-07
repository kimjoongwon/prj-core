---
name: "fe-selection-creator"
description: "Use when the `fe-selection-agent` agent_type is assigned to create or clean up Web/Mobile selection primitives in packages/fe-ui/src/selection or packages/fe-mo-ui/src/selection."
---

# fe-selection-creator

Use this skill when operating as `fe-selection-agent`.

## Workflow

1. Confirm the user task, approved spec, and ownership boundary from `.codex/agents/fe-selection-agent.toml`.
2. Read `references/agent-instructions.md` before source changes.
3. Apply only the selection portions relevant to the assigned platform and target path.
4. Keep work inside selection source, colocated stories/tests, local barrels, and minimal consuming imports needed for correctness.
5. Run the validation requested by the spec or detailed instructions when feasible, then summarize results and any remaining risk.

## References

- `references/agent-instructions.md`: selection primitive implementation contract.

