import type { Request } from "express";
import type { NativeLoginCommandInput } from "@cocrepo/input";

export class NativeLoginCommand implements NativeLoginCommandInput {
	readonly email!: NativeLoginCommandInput["email"];
	readonly password!: NativeLoginCommandInput["password"];

	constructor(
		input: NativeLoginCommandInput,
		readonly req: Request,
	) {
		Object.assign(this, input);
	}
}
