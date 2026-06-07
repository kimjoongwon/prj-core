# Detailed Instructions for fe-navigation-agent

Source subagent file: `.codex/agents/fe-navigation-agent.toml`

## Platform Routing

- React Web target: `packages/fe-ui/src/navigation/**` plus minimal consuming imports.
- React Native target: `packages/fe-mo-ui/src/navigation/**` plus minimal consuming imports.
- Do not apply the other platform's runtime rules except as context.

## Common

- Navigation primitives represent movement, page position, disclosure of navigable structure, or view switching at the primitive layer. Examples: `Link`, `Tabs`, `Pagination`, `Breadcrumbs`, `Accordion`, `Disclosure`, `DisclosureGroup`, mobile `CustomHeader`.
- `fe-menu-agent` owns menu trees, side nav, bottom tabs, route-shell navigation composition, and menu contracts. Stop and report if those files are required.
- Do not own command buttons, typed/freeform inputs, choice controls outside navigation, overlays, data display, feedback, layout, widgets, features, screens, routes, or data-grid files.
- Reuse upstream HeroUI/HeroUI Native and existing `@cocrepo/ui` or `@cocrepo/mo-ui` leaves before creating a new component.
- Keep source, colocated story/test, and local barrel updates in the same owner change.

## React Web

- Web files live under `packages/fe-ui/src/navigation/[Name]/`.
- Story titles use `navigation/[Name]`.
- Exports flow through `packages/fe-ui/src/navigation/index.ts` and then `packages/fe-ui/src/index.ts`.
- Do not implement Next.js route policy, route layouts, or menu data contracts in this layer.

## React Native

- Mobile files live under `packages/fe-mo-ui/src/navigation/[Name]/`.
- Use upstream HeroUI Native navigation primitives before custom wiring.
- User-visible text must use the mobile `Text` primitive.

## Validation

- Run package or Storybook type checks requested by the spec when feasible.
- For changed navigation primitives, verify active/selected/current page state, disabled state, link target behavior, and change callbacks in story or unit coverage when practical.

