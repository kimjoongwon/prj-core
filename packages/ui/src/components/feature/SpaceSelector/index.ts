export {
	SpaceSelector,
	type SpaceSelectorProps,
	type SpaceSelectorSpace,
	// 하위 호환성 유지
	type ContextSelectorContext,
} from "./SpaceSelector";

// 하위 호환성을 위한 alias (deprecated)
export { SpaceSelector as ContextSelector } from "./SpaceSelector";
export type { SpaceSelectorProps as ContextSelectorProps } from "./SpaceSelector";
