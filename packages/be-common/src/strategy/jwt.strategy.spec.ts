import { hydrateEntity, User } from "@cocrepo/entity";
import type { AuthCacheService, UserService } from "@cocrepo/service";
import {
	parseBigIntJson,
	stringifyBigIntJson,
} from "@cocrepo/type/bigint-json";
import { UnauthorizedException } from "@nestjs/common";
import type { ConfigService } from "@nestjs/config";
import { type MockProxy, mock } from "jest-mock-extended";
import type { ClsService } from "nestjs-cls";
import { JwtStrategy } from "./jwt.strategy";

// 인증 전략에 주입하지 않는 서비스들의 초기화는 이 단위 테스트에서 제외합니다.
jest.mock("@cocrepo/service", () => ({
	AuthCacheService: class AuthCacheService {},
	UserService: class UserService {},
}));

describe("JwtStrategy 인증 사용자 복원", () => {
	let jwtStrategy: JwtStrategy;
	let usersService: MockProxy<UserService>;
	let authCacheService: MockProxy<AuthCacheService>;
	const authenticatedUserId = "01ARZ3NDEKTSV4RRFFQ69G5FAV";
	const jwtPayload = {
		sub: authenticatedUserId,
		iat: 1_700_000_000,
		exp: 1_700_000_600,
	};

	beforeEach(() => {
		usersService = mock<UserService>();
		authCacheService = mock<AuthCacheService>();
		jwtStrategy = new JwtStrategy(
			mock<ConfigService>(),
			usersService,
			mock<ClsService>(),
			authCacheService,
		);
	});

	it("캐시 적중 시 내부 필드·날짜 문자열·bigint와 User 도메인 동작을 보존한다", async () => {
		const cachedUserSnapshot = {
			id: 9_007_199_254_740_993n,
			userId: authenticatedUserId,
			name: "관리자",
			email: "Mixed.Case@Example.COM",
			password: "$2b$10$stored.password.hash",
			createdAt: "2023-11-14T22:13:20.000Z",
			updatedAt: null,
			removedAt: null,
			lockedUntil: "2023-11-14T23:13:20.000Z",
			passwordChangedAt: "2023-11-14T20:13:20.000Z",
			lastLoginAt: "2023-11-14T21:13:20.000Z",
			isPermanentlyLocked: false,
			mustChangePassword: true,
			currentTenantId: 9_007_199_254_740_994n,
			tenants: [{ id: 9_007_199_254_740_994n, spaceId: 301n }],
		};
		authCacheService.get.mockResolvedValue(
			stringifyBigIntJson(cachedUserSnapshot),
		);

		const authenticatedUser = await jwtStrategy.validate(jwtPayload);

		expect(authCacheService.get).toHaveBeenCalledWith(authenticatedUserId);
		expect(authenticatedUser).toBeInstanceOf(User);
		expect(authenticatedUser).toMatchObject(cachedUserSnapshot);
		expect(authenticatedUser.hasTenantAccess(9_007_199_254_740_994n)).toBe(
			true,
		);
		expect(authenticatedUser.hasTenantAccess(9_007_199_254_740_995n)).toBe(
			false,
		);
		expect(authenticatedUser.canAccessSpace(301n)).toBe(true);
		expect(authenticatedUser.accessibleSpaceIds).toEqual([301n]);
		expect(authenticatedUser.needsPasswordChange()).toBe(true);
		expect(authenticatedUser.isNotRemoved()).toBe(true);
		expect(usersService.findByUserIdWithTenants).not.toHaveBeenCalled();
		expect(authCacheService.set).not.toHaveBeenCalled();
	});

	it("캐시 미스는 DB Entity와 Date를 반환하고 다음 적중에서 기존 JSON 형식으로 복원한다", async () => {
		jest.spyOn(Date, "now").mockReturnValue(jwtPayload.iat * 1000);
		const databaseUser = hydrateEntity(User, {
			id: 101n,
			userId: authenticatedUserId,
			email: "Existing.Case@Example.COM",
			password: "$2b$10$database.password.hash",
			createdAt: new Date("2023-11-14T22:13:20.000Z"),
			lastLoginAt: new Date("2023-11-14T22:00:00.000Z"),
			removedAt: null,
			tenants: [{ id: 201n, spaceId: 301n }],
		});
		authCacheService.get.mockResolvedValue(null);
		usersService.findByUserIdWithTenants.mockResolvedValue(databaseUser);

		const uncachedUser = await jwtStrategy.validate(jwtPayload);

		expect(uncachedUser).toBe(databaseUser);
		expect(uncachedUser.createdAt).toBeInstanceOf(Date);
		expect(usersService.findByUserIdWithTenants).toHaveBeenCalledWith(
			authenticatedUserId,
		);
		expect(authCacheService.set).toHaveBeenCalledWith(
			authenticatedUserId,
			stringifyBigIntJson(databaseUser),
			600,
		);
		const savedUserJson = authCacheService.set.mock.calls[0][1];
		authCacheService.get.mockResolvedValue(savedUserJson);

		const cachedUser = await jwtStrategy.validate(jwtPayload);

		expect(cachedUser).toBeInstanceOf(User);
		expect(cachedUser).toMatchObject(parseBigIntJson(savedUserJson));
		expect(cachedUser.createdAt).toBe(databaseUser.createdAt.toISOString());
		expect(cachedUser.lastLoginAt).toBe(
			databaseUser.lastLoginAt?.toISOString(),
		);
		expect(cachedUser.hasTenantAccess(201n)).toBe(true);
		expect(usersService.findByUserIdWithTenants).toHaveBeenCalledTimes(1);
		expect(authCacheService.set).toHaveBeenCalledTimes(1);
	});

	it("캐시와 DB 모두 사용자가 없으면 인증을 거부하고 캐시를 저장하지 않는다", async () => {
		authCacheService.get.mockResolvedValue(null);
		usersService.findByUserIdWithTenants.mockResolvedValue(null);

		await expect(jwtStrategy.validate(jwtPayload)).rejects.toThrow(
			UnauthorizedException,
		);
		expect(authCacheService.set).not.toHaveBeenCalled();
	});
});
