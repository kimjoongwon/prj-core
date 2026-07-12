import type { RefreshNativeMobileSessionCommandInput } from "@cocrepo/input";
export class RefreshNativeMobileSessionCommand
	implements RefreshNativeMobileSessionCommandInput
{
	readonly sessionId!: RefreshNativeMobileSessionCommandInput["sessionId"];
	readonly refreshToken!: RefreshNativeMobileSessionCommandInput["refreshToken"];

	constructor(input: RefreshNativeMobileSessionCommandInput) {
		Object.assign(this, input);
	}
}
