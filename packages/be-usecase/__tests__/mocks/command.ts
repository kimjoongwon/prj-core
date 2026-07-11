export class NativeLoginCommand {
	constructor(
		readonly input: { email: string; password: string },
		readonly req: unknown,
	) {}
}

export class HandleOidcCallbackCommand {
	constructor(
		readonly clientId: string,
		readonly code: string,
		readonly state: string,
		readonly error: string,
		readonly errorDescription: string,
		readonly req: unknown,
		readonly res: unknown,
	) {}
}

export class SubmitInteractionLoginCommand {
	constructor(
		readonly input: {
			email: string;
			password: string;
			remember?: boolean;
		},
		readonly req: unknown,
		readonly res: unknown,
	) {}
}

export class HandleOidcCommand {
	constructor(
		readonly req: { url: string },
		readonly res: unknown,
	) {}
}

export class GetCurrentSpaceQuery {}

export class SetCurrentSpaceCommand {
	readonly tenantId: string;

	constructor(input: { tenantId: string }) {
		this.tenantId = input.tenantId;
	}
}
