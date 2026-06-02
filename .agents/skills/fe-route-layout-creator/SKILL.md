---
name: "fe-route-layout-creator"
description: "Use when the `fe-route-layout-agent` agent_type is assigned to Next.js layout과 Expo Router _layout.tsx shell/topology를 설계하고 구현하는 전문가. This creator skill contains the detailed workflow, implementation rules, and validation contract moved out of the thin agent TOML."
---

# fe-route-layout-creator

Use this skill when operating as `fe-route-layout-agent` or when a task explicitly asks for this creator workflow.

## Workflow

1. Confirm the user task, approved spec, and ownership boundary from `.codex/agents/fe-route-layout-agent.toml`.
2. Read `references/agent-instructions.md` before source changes; it contains the detailed implementation rules for this creator.
3. Apply only the sections relevant to the assigned target. For platform-aware FE creators, choose the target platform from file paths before applying Web or React Native rules.
4. Keep work inside the agent ownership boundary. If another role owns the needed file or sequence, stop and summarize the handoff need in the final report.
5. Run the validation requested by the spec or detailed instructions when feasible, then summarize results and any remaining risk.

## References

- `references/agent-instructions.md`: detailed workflow and implementation contract migrated from the original agent TOML.
