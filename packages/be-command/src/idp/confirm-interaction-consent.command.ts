import type { KoaLikeRequest, KoaLikeResponse } from "./interaction.types";

export class ConfirmInteractionConsentCommand {
	constructor(
		readonly req: KoaLikeRequest,
		readonly res: KoaLikeResponse,
	) {}
}
