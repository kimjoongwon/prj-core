import type { KoaLikeRequest, KoaLikeResponse } from "@cocrepo/command";

export interface InteractionPort {
	getInteractionDetails(
		req: KoaLikeRequest,
		res: KoaLikeResponse,
	): Promise<{
		prompt: { name: string; details?: Record<string, unknown> };
		params: Record<string, unknown>;
		session?: Record<string, unknown>;
	}>;
	findClient(clientId: string): Promise<
		| {
				clientId: string;
				name?: string;
				logoUri?: string | null;
				loginUi?: unknown;
		  }
		| null
		| undefined
	>;
	completeLogin(
		req: KoaLikeRequest,
		res: KoaLikeResponse,
		accountId: string,
		remember: boolean,
	): Promise<{ redirectTo: string }>;
	processConsent(
		req: KoaLikeRequest,
		res: KoaLikeResponse,
	): Promise<{ redirectTo: string }>;
	abortInteraction(
		req: KoaLikeRequest,
		res: KoaLikeResponse,
	): Promise<{ redirectTo: string }>;
}
