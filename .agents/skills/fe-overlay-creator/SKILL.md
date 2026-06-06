---
name: "fe-overlay-creator"
description: "Use when the `fe-overlay-agent` subagent is assigned to create or clean up Web/Mobile overlay, dialog, popover, tooltip, and portal primitives in packages/fe-ui/src/overlay or the mobile overlay leaves under packages/fe-mo-ui/src/layout and packages/fe-mo-ui/src/design-system/portal."
---

# fe-overlay-creator

Use this skill when operating as `fe-overlay-agent`.

## Workflow

1. Confirm the user task, approved spec, and ownership boundary from `.codex/agents/fe-overlay-agent.toml`.
2. Read `../fe-display-creator/references/agent-instructions.md` before source changes; it contains the shared primitive implementation rules.
3. Apply only the overlay/dialog/popover/tooltip portions relevant to the assigned platform and target path.
4. Keep work inside overlay source, mobile `layout/{BottomSheet,Dialog,Popover}` leaves, `design-system/portal`, colocated stories/tests, local barrels, and minimal consuming imports needed for correctness.
5. Run the validation requested by the spec or detailed instructions when feasible, then summarize results and any remaining risk.

## References

- `../fe-display-creator/references/agent-instructions.md`: shared Web/Mobile primitive implementation contract.
