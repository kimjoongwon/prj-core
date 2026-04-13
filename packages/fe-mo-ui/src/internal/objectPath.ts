function toSegments(path: string) {
	return path
		.replace(/\[(\d+)\]/g, ".$1")
		.split(".")
		.map((segment) => segment.trim())
		.filter(Boolean);
}

export function getPathValue<TState extends object, TValue>(
	state: TState,
	path: string,
	fallback: TValue,
) {
	if (!path) {
		return fallback;
	}

	const value = toSegments(path).reduce<unknown>((current, segment) => {
		if (current == null || typeof current !== "object") {
			return undefined;
		}

		return (current as Record<string, unknown>)[segment];
	}, state);

	return (value as TValue | undefined) ?? fallback;
}

export function setPathValue(
	state: Record<string, unknown>,
	path: string,
	value: unknown,
) {
	const segments = toSegments(path);

	if (!segments.length) {
		return;
	}

	let current: Record<string, unknown> = state;

	segments.slice(0, -1).forEach((segment, index) => {
		const nextSegment = segments[index + 1];
		const nextValue = current[segment];

		if (nextValue == null || typeof nextValue !== "object") {
			current[segment] = /^\d+$/.test(nextSegment) ? [] : {};
		}

		current = current[segment] as Record<string, unknown>;
	});

	current[segments[segments.length - 1]] = value;
}
