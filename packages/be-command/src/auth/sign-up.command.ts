import type { SignUpPayloadDto } from "@cocrepo/dto";

export class SignUpCommand {
	constructor(readonly signUpDto: SignUpPayloadDto) {}
}
