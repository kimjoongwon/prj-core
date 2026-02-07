import { Injectable, type NestMiddleware } from "@nestjs/common";
import type { NextFunction, Request, Response } from "express";
import * as passport from "passport";

/**
 * JWT 인증을 Middleware에서 수행하여 Guard 이전에 request.user를 설정
 *
 * - 기존 JwtStrategy를 그대로 재사용 (passport는 전역 싱글턴)
 * - 토큰이 없거나 유효하지 않아도 에러를 throw하지 않음 → Guard에서 처리
 */
@Injectable()
export class AuthMiddleware implements NestMiddleware {
	use(req: Request, res: Response, next: NextFunction) {
		passport.authenticate(
			"jwt",
			{ session: false },
			(err: any, user: any) => {
				if (user) {
					req.user = user;
				}
				next();
			},
		)(req, res, next);
	}
}
