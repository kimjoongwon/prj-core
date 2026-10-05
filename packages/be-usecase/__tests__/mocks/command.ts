export class CreateSpaceCommand {
	constructor(input: Record<string, unknown>) {
		Object.assign(this, input);
	}
}

export class GetSpaceFitnessCenterQuery {
	constructor(readonly spaceId: string) {}
}

export class UpdateSpaceFitnessCenterCommand {
	constructor(
		readonly spaceId: string,
		input: Record<string, unknown>,
	) {
		Object.assign(this, input);
	}
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

export class RefreshTokenWithIdpCommand {
	constructor(
		readonly refreshTokenCookie: string | undefined,
		readonly refreshTokenHeader: string | undefined,
		readonly sessionId: string | undefined,
		readonly res: unknown,
	) {}
}

export class LogoutWithCookieCommand {
	constructor(
		readonly accessTokenCookie: string | undefined,
		readonly authorizationHeader: string | undefined,
		readonly sessionId: string | undefined,
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

export class CreateActionCommand {
	constructor(input: Record<string, unknown>) {
		Object.assign(this, input);
	}
}

export class UpdateActionCommand {
	constructor(
		readonly actionId: bigint,
		input: Record<string, unknown>,
	) {
		Object.assign(this, input);
	}
}

export class DeleteActionCommand {
	constructor(readonly actionId: bigint) {}
}
