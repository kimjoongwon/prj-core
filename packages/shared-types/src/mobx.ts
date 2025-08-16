import type { Paths, Leaves } from "./core";

// MobX related types
export interface MobxProps<T = any> {
	path: Paths<T, 4>;
	state: T;
}

// Form and component props interfaces
export interface FormUnitProps<T> {
	state: T;
	path: Leaves<T, 4>;
}