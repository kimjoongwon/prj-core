import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
	private logger = new Logger("HTTP");
	use(req: Request, res: Response, next: NextFunction) {
		this.logger.log(
			`HTTP 요청 로깅: ${req.method} ${req.url} ${res.statusCode}`,
		);

		next();
	}
}
