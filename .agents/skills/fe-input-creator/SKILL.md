---
name: "fe-input-creator"
description: "Use when the `fe-input-agent` agent_type is assigned to create or clean up Web/Mobile input primitives in packages/fe-ui/src/input or packages/fe-mo-ui/src/input."
---

# fe-input-creator

Use this skill when operating as `fe-input-agent`.

## Workflow

1. Confirm the user task, approved spec, and ownership boundary from `.codex/agents/fe-input-agent.toml`.
2. Read `references/agent-instructions.md` before source changes.
3. Apply only the input portions relevant to the assigned platform and target path.
4. Keep work inside input source, colocated stories/tests, local barrels, and minimal consuming imports needed for correctness.
5. Run the validation requested by the spec or detailed instructions when feasible, then summarize results and any remaining risk.

## References

- `references/agent-instructions.md`: input primitive implementation contract.

