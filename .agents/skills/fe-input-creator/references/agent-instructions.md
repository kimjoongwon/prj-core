# Detailed Instructions for fe-input-agent

Source subagent file: `.codex/agents/fe-input-agent.toml`

## Platform Routing

- React Web target: `packages/fe-ui/src/input/**` plus minimal consuming imports.
- React Native target: `packages/fe-mo-ui/src/input/**` plus minimal consuming imports.
- Do not apply the other platform's runtime rules except as context.

## Common

- Input primitives capture typed/freeform user values or project-specific input behavior. Examples: `Input`, `TextField`, `TextArea`, `SearchField`, `NumberField`, `DateField`, `TimeInput`, `ColorField`, `InputOTP`, `InputGroup`, `FileUploader`, `StringListInput`.
- React Web field metadata/composition primitives that add no project behavior, such as HeroUI `Label`, `Description`, `FieldError`, `ErrorMessage`, and `Fieldset`, are not owned as local `@cocrepo/ui` wrappers. Import them directly from `@heroui/react` where needed.
- Do not own command buttons, choice controls, navigation, menu composition, overlays, data display, feedback, layout, widgets, features, screens, routes, or data-grid files.
- Reuse upstream HeroUI/HeroUI Native and existing `@cocrepo/ui` or `@cocrepo/mo-ui` leaves before creating a new component.
- Keep source, colocated story/test, and local barrel updates in the same owner change.
- Do not add business logic, API calls, route decisions, or app-specific names to input primitives.

## React Web

- Web files live under `packages/fe-ui/src/input/[Name]/`.
- Story titles use `input/[Name]`.
- Exports flow through `packages/fe-ui/src/input/index.ts` and then `packages/fe-ui/src/index.ts`.
- If a MobX-bound wrapper is needed, keep the pure component and stateful wrapper separated inside the same component folder.

## React Native

- Mobile files live under `packages/fe-mo-ui/src/input/[Name]/`.
- Use upstream `TextField`, `Label`, `Description`, `FieldError`, and `InputGroup` composition before custom field wiring.
- User-visible text must use the mobile `Text` primitive; raw `react-native` `Text` import is only allowed inside the text primitive implementation.

## Validation

- Run package or Storybook type checks requested by the spec when feasible.
- For changed input primitives, verify value change, disabled/read-only/error/helper states in story or unit coverage when practical.
