import type { NativeTokenRefreshPayloadDto } from "@cocrepo/dto";

export class RefreshNativeMobileSessionCommand {
	constructor(readonly dto: NativeTokenRefreshPayloadDto) {}
}
