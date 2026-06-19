import type { LogoutNativeMobileSessionCommandInput } from "./logout-native-mobile-session.input";
export class LogoutNativeMobileSessionCommand {
	constructor(
		readonly input: LogoutNativeMobileSessionCommandInput,
		readonly authorizationHeader?: string,
	) {}
}
