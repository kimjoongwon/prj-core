import type { LogoutNativeMobileSessionCommandInput } from "@cocrepo/input";
export class LogoutNativeMobileSessionCommand implements LogoutNativeMobileSessionCommandInput {
	readonly sessionId!: LogoutNativeMobileSessionCommandInput["sessionId"];
	readonly refreshToken?: LogoutNativeMobileSessionCommandInput["refreshToken"];

	constructor(
		input: LogoutNativeMobileSessionCommandInput,
		readonly authorizationHeader?: string,
	) {
		Object.assign(this, input);
	}
}
