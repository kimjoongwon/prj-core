import { cloneDeep, get, range, set } from "lodash-es";

// Object property utilities
export function getProperty(
	object: any,
	path: string | string[],
	defaultValue?: any,
): any {
	return get(object, path, defaultValue);
}

export function setProperty(
	object: any,
	path: string | string[],
	value: any,
): any {
	return set(object, path, value);
}

// Deep cloning utility
export function deepClone<T>(value: T): T {
	return cloneDeep(value);
}

// Array utilities
export function createRange(
	start: number,
	end?: number,
	step?: number,
): number[] {
	return range(start, end, step);
}

// Tool object for useFormField compatibility
export const tools = {
	get: getProperty,
	set: setProperty,
	clone: deepClone,
	range: createRange,
};
