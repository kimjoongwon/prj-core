---
name: "fe-action-creator"
description: "Use when the `fe-action-agent` agent_type is assigned to create or clean up Web/Mobile action primitives in packages/fe-ui/src/action or packages/fe-mo-ui/src/action."
---

# fe-action-creator

Use this skill when operating as `fe-action-agent`.

## Workflow

1. Confirm the user task, approved spec, and ownership boundary from `.codex/agents/fe-action-agent.toml`.
2. Read `references/agent-instructions.md` before source changes.
3. Apply only the action portions relevant to the assigned platform and target path.
4. Keep work inside action source, colocated stories/tests, local barrels, and minimal consuming imports needed for correctness.
5. Run the validation requested by the spec or detailed instructions when feasible, then summarize results and any remaining risk.

## References

- `references/agent-instructions.md`: action primitive implementation contract.

