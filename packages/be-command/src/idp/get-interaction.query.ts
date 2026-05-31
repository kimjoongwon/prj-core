import type { KoaLikeRequest, KoaLikeResponse } from "./interaction.types";

export class GetInteractionQuery {
	constructor(
		readonly uid: string,
		readonly req: KoaLikeRequest,
		readonly res: KoaLikeResponse,
	) {}
}
