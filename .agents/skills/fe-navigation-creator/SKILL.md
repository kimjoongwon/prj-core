---
name: "fe-navigation-creator"
description: "Use when the `fe-navigation-agent` agent_type is assigned to create or clean up Web/Mobile navigation primitives in packages/fe-ui/src/navigation or packages/fe-mo-ui/src/navigation."
---

# fe-navigation-creator

Use this skill when operating as `fe-navigation-agent`.

## Workflow

1. Confirm the user task, approved spec, and ownership boundary from `.codex/agents/fe-navigation-agent.toml`.
2. Read `references/agent-instructions.md` before source changes.
3. Apply only the navigation primitive portions relevant to the assigned platform and target path.
4. Keep work inside navigation source, colocated stories/tests, local barrels, and minimal consuming imports needed for correctness.
5. Keep menu/route-shell composition in `fe-menu-agent` or route owners; stop and report if the task needs those files.
6. Run the validation requested by the spec or detailed instructions when feasible, then summarize results and any remaining risk.

## References

- `references/agent-instructions.md`: navigation primitive implementation contract.

