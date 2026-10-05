const EMPTY_ITERATOR = function* emptyIterator() {
	yield* [];
};

/**
 * Storybook에서 아직 정밀 fixture를 준비하지 못한 복합 prop을 안전하게 채우기 위한 deep mock입니다.
 * 배열/객체/함수처럼 동작하도록 최소한의 trap만 제공합니다.
 */
export function createStorybookMock(label = "page-story-mock"): unknown {
	const callable = () => undefined;

	return new Proxy(callable, {
		apply: () => undefined,
		get: (_target, prop) => {
			if (prop === Symbol.iterator) {
				return EMPTY_ITERATOR;
			}

			if (prop === "then") {
				return undefined;
			}

			if (prop === "length" || prop === "size") {
				return 0;
			}

			if (
				prop === "map" ||
				prop === "filter" ||
				prop === "flatMap" ||
				prop === "slice"
			) {
				return () => [];
			}

			if (prop === "find") {
				return () => undefined;
			}

			if (prop === "some") {
				return () => false;
			}

			if (prop === "every") {
				return () => true;
			}

			if (prop === "reduce") {
				return (_reducer: unknown, initialValue: unknown) => initialValue;
			}

			if (prop === "forEach") {
				return () => undefined;
			}

			if (prop === "join") {
				return () => "";
			}

			if (prop === "toString" || prop === "valueOf") {
				return () => label;
			}

			return createStorybookMock(`${label}.${String(prop)}`);
		},
		getOwnPropertyDescriptor: () => ({
			configurable: true,
			enumerable: true,
			writable: false,
			value: undefined,
		}),
		ownKeys: () => [],
		set: () => true,
	});
}
