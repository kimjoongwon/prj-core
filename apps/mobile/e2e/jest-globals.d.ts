declare function describe(name: string, fn: () => void): void;

declare function beforeAll(
	fn: () => Promise<unknown> | unknown,
	timeout?: number,
): void;

declare function it(
	name: string,
	fn: () => Promise<unknown> | unknown,
	timeout?: number,
): void;
