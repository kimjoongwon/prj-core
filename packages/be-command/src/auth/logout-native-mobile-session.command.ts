import type { NativeLogoutPayloadDto } from "@cocrepo/dto";

export class LogoutNativeMobileSessionCommand {
	constructor(
		readonly dto: NativeLogoutPayloadDto,
		readonly accessToken?: string,
	) {}
}
