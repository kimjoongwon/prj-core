# Detailed Instructions for fe-action-agent

Source subagent file: `.codex/agents/fe-action-agent.toml`

## Platform Routing

- React Web target: `packages/fe-ui/src/action/**` plus minimal consuming imports.
- React Native target: `packages/fe-mo-ui/src/action/**` plus minimal consuming imports.
- Do not apply the other platform's runtime rules except as context.

## Common

- Action primitives trigger an immediate user action. Examples: `Button`, `ButtonGroup`, `CloseButton`, `PressableFeedback`.
- Do not own text/value entry, choice state, navigation, menu composition, overlays, data display, feedback, layout, widgets, features, screens, routes, or data-grid files.
- Reuse upstream HeroUI/HeroUI Native and existing `@cocrepo/ui` or `@cocrepo/mo-ui` leaves before creating a new component.
- Keep source, colocated story/test, and local barrel updates in the same owner change.
- Do not add business logic, API calls, route decisions, or app-specific names to action primitives.

## React Web

- Web files live under `packages/fe-ui/src/action/[Name]/`.
- Story titles use `action/[Name]`.
- Exports flow through `packages/fe-ui/src/action/index.ts` and then `packages/fe-ui/src/index.ts`.
- Web action components wrap `@heroui/react` action primitives when available; custom implementations are only for gaps that upstream cannot cover.

## React Native

- Mobile files live under `packages/fe-mo-ui/src/action/[Name]/`.
- Use HeroUI Native composition and uniwind/tailwind-variants patterns from the project guide.
- If string children are accepted, normalize them through the mobile `Text` primitive before passing to HeroUI Native.

## Validation

- Run package or Storybook type checks requested by the spec when feasible.
- For changed action primitives, verify disabled/loading/pressed/action callback states in story or unit coverage when practical.

