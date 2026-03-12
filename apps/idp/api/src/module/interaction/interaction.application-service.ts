import { Injectable } from "@nestjs/common";
import type { KoaLikeRequest, KoaLikeResponse, OidcClientInfo } from "../oidc/types";
import {
	InteractionService,
	type Interaction,
	type InteractionResult,
	type LoginValidationResult,
} from "./interaction.service";

@Injectable()
export class InteractionApplicationService {
	constructor(private readonly interactionService: InteractionService) {}

	getInteractionDetails(req: KoaLikeRequest, res: KoaLikeResponse): Promise<Interaction> {
		return this.interactionService.getInteractionDetails(req, res);
	}

	findClient(clientId: string): Promise<OidcClientInfo | undefined> {
		return this.interactionService.findClient(clientId);
	}

	validateUser(
		email: string,
		password: string,
		ipAddress: string,
		userAgent?: string,
	): Promise<LoginValidationResult> {
		return this.interactionService.validateUser(
			email,
			password,
			ipAddress,
			userAgent,
		);
	}

	completeLogin(
		req: KoaLikeRequest,
		res: KoaLikeResponse,
		accountId: string,
		remember = false,
	): Promise<InteractionResult> {
		return this.interactionService.completeLogin(req, res, accountId, remember);
	}

	processConsent(
		req: KoaLikeRequest,
		res: KoaLikeResponse,
	): Promise<InteractionResult> {
		return this.interactionService.processConsent(req, res);
	}

	abortInteraction(
		req: KoaLikeRequest,
		res: KoaLikeResponse,
	): Promise<InteractionResult> {
		return this.interactionService.abortInteraction(req, res);
	}
}
