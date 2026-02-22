export abstract class BaseEnum {
	protected constructor(
		protected readonly _code: string,
		protected readonly _name: string,
	) {}

	get code(): string {
		return this._code;
	}

	get name(): string {
		return this._name;
	}

	equals(code: string): boolean {
		return this.code === code;
	}
}
