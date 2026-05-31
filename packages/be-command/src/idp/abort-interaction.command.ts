import type { KoaLikeRequest, KoaLikeResponse } from "./interaction.types";

export class AbortInteractionCommand {
	constructor(
		readonly req: KoaLikeRequest,
		readonly res: KoaLikeResponse,
	) {}
}
