# Detailed Instructions for fe-selection-agent

Source subagent file: `.codex/agents/fe-selection-agent.toml`

## Platform Routing

- React Web target: `packages/fe-ui/src/selection/**` plus minimal consuming imports.
- React Native target: `packages/fe-mo-ui/src/selection/**` plus minimal consuming imports.
- Do not apply the other platform's runtime rules except as context.

## Common

- Selection primitives let a user choose from constrained values or ranges. Examples: `Select`, `ComboBox`, `AutoComplete`, `Checkbox`, `CheckboxGroup`, `RadioGroup`, `Switch`, `Slider`, `DatePicker`, `DateRangePicker`, `Calendar`, `RangeCalendar`, `ColorPicker`, `ColorArea`, `ColorSlider`, `ColorSwatchPicker`, `ChipSelect`, `ListBoxSelect`, `MultiSelect`, `ToggleButton`, `ToggleButtonGroup`, `WeekInput`.
- Do not own command buttons, typed/freeform inputs, navigation, menu composition, overlays, data display, feedback, layout, widgets, features, screens, routes, or data-grid files.
- Reuse upstream HeroUI/HeroUI Native and existing `@cocrepo/ui` or `@cocrepo/mo-ui` leaves before creating a new component.
- Keep source, colocated story/test, and local barrel updates in the same owner change.
- Do not add business logic, API calls, route decisions, or app-specific names to selection primitives.

## React Web

- Web files live under `packages/fe-ui/src/selection/[Name]/`.
- Story titles use `selection/[Name]`.
- Exports flow through `packages/fe-ui/src/selection/index.ts` and then `packages/fe-ui/src/index.ts`.
- If a MobX-bound wrapper is needed, keep the pure component and stateful wrapper separated inside the same component folder.

## React Native

- Mobile files live under `packages/fe-mo-ui/src/selection/[Name]/`.
- Use upstream checkbox, radio, select, switch, slider, calendar, tabs, and control-field primitives before custom selection wiring.
- User-visible text must use the mobile `Text` primitive.

## Validation

- Run package or Storybook type checks requested by the spec when feasible.
- For changed selection primitives, verify selected value, disabled state, option rendering, and change callbacks in story or unit coverage when practical.

