import type { Request, Response } from "express";

export interface OidcProviderPort {
	reload(): Promise<void>;
	getProvider(): {
		callback(): (req: Request, res: Response) => Promise<void>;
	};
}
