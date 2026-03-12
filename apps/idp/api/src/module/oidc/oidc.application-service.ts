import { Injectable } from "@nestjs/common";
import type { Request, Response } from "express";
import { OidcProviderService } from "./oidc-provider.service";

@Injectable()
export class OidcApplicationService {
	constructor(private readonly oidcProviderService: OidcProviderService) {}

	handleOidc(req: Request, res: Response): Promise<void> | void {
		const provider = this.oidcProviderService.getProvider();
		const callback = provider.callback();

		// oidc-provider는 Koa 기반이므로 Express 요청을 변환
		// path를 /oidc prefix 없이 전달
		req.url = req.url.replace(/^\/oidc/, "") || "/";

		// callback은 (req, res) 형태의 http request handler
		return callback(req, res);
	}
}
