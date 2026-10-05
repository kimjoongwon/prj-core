import type { NextFunction, Request, Response } from "express";
import * as passport from "passport";
import { AuthMiddleware } from "./auth.middleware";

type PassportAuthenticateCallback = (
	error: Error | null,
	user: Express.User | false | null,
) => void;

jest.mock("passport", () => ({
	authenticate: jest.fn(),
}));

describe("AuthMiddleware", () => {
	let middleware: AuthMiddleware;
	let mockReq: Partial<Request>;
	let mockRes: Partial<Response>;
	let mockNext: jest.MockedFunction<NextFunction>;

	beforeEach(() => {
		middleware = new AuthMiddleware();
		mockReq = {
			headers: {},
		};
		mockRes = {};
		mockNext = jest.fn();
		jest.clearAllMocks();
	});

	it("미들웨어가 정의되어야 한다", () => {
		expect(middleware).toBeDefined();
	});

	describe("use", () => {
		it("passport.authenticate('jwt')를 호출해야 한다", () => {
			// Given
			const innerFn = jest.fn();
			(passport.authenticate as jest.Mock).mockReturnValue(innerFn);

			// When
			middleware.use(mockReq as Request, mockRes as Response, mockNext);

			// Then
			expect(passport.authenticate).toHaveBeenCalledWith(
				"jwt",
				{ session: false },
				expect.any(Function),
			);
			expect(innerFn).toHaveBeenCalledWith(mockReq, mockRes, mockNext);
		});

		it("유효한 사용자가 있으면 request.user를 설정해야 한다", () => {
			// Given
			const mockUser = { id: 101n, email: "test@example.com" };
			(passport.authenticate as jest.Mock).mockImplementation(
				(
					_strategy: string,
					_options: unknown,
					callback: PassportAuthenticateCallback,
				) => {
					return () => callback(null, mockUser);
				},
			);

			// When
			middleware.use(mockReq as Request, mockRes as Response, mockNext);

			// Then
			expect(mockReq.user).toBe(mockUser);
			expect(mockNext).toHaveBeenCalled();
		});

		it("사용자가 없으면 request.user를 설정하지 않아야 한다", () => {
			// Given
			(passport.authenticate as jest.Mock).mockImplementation(
				(
					_strategy: string,
					_options: unknown,
					callback: PassportAuthenticateCallback,
				) => {
					return () => callback(null, null);
				},
			);

			// When
			middleware.use(mockReq as Request, mockRes as Response, mockNext);

			// Then
			expect(mockReq.user).toBeUndefined();
			expect(mockNext).toHaveBeenCalled();
		});

		it("passport 에러가 발생해도 next()를 호출해야 한다 (Guard에서 처리)", () => {
			// Given
			const error = new Error("JWT 검증 실패");
			(passport.authenticate as jest.Mock).mockImplementation(
				(
					_strategy: string,
					_options: unknown,
					callback: PassportAuthenticateCallback,
				) => {
					return () => callback(error, null);
				},
			);

			// When
			middleware.use(mockReq as Request, mockRes as Response, mockNext);

			// Then
			expect(mockReq.user).toBeUndefined();
			expect(mockNext).toHaveBeenCalled();
		});

		it("user가 false(passport 실패 관례)이면 request.user를 설정하지 않아야 한다", () => {
			// Given
			(passport.authenticate as jest.Mock).mockImplementation(
				(
					_strategy: string,
					_options: unknown,
					callback: PassportAuthenticateCallback,
				) => {
					return () => callback(null, false);
				},
			);

			// When
			middleware.use(mockReq as Request, mockRes as Response, mockNext);

			// Then
			expect(mockReq.user).toBeUndefined();
			expect(mockNext).toHaveBeenCalled();
		});
	});
});
