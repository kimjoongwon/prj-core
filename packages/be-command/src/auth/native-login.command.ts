import type { NativeLoginCommandInput } from "@cocrepo/input";
import type { Request } from "express";

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
