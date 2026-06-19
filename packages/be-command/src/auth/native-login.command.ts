import type { NativeLoginCommandInput } from "./native-login.input";
import type { Request } from "express";

export class NativeLoginCommand {
	constructor(
		readonly input: NativeLoginCommandInput,
		readonly req: Request,
	) {}
}
