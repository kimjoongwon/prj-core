import { CONTEXT_KEYS } from "@cocrepo/constant";
import { PUBLIC_ROUTE_KEY, SKIP_SPACE_CHECK_KEY } from "@cocrepo/decorator";
import { SpacesRepository } from "@cocrepo/repository";
import { SpaceResourceScope } from "@cocrepo/type";
import {
	BadRequestException,
	type CallHandler,
	type ExecutionContext,
	ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { of } from "rxjs";
import { SPACE_SCOPE_KEY } from "./space-scope.decorator";
import { SpaceScopeInterceptor } from "./space-scope.interceptor";

describe("SpaceScopeInterceptor", () => {
	let interceptor: SpaceScopeInterceptor;
	let mockCls: { get: jest.Mock; set: jest.Mock };
	let mockReflector: jest.Mocked<Reflector>;
	let mockSpacesRepository: {
		findSpaceIdsByCategoryHierarchy: jest.Mock;
	};
	let next: CallHandler;

	const createContext = (): ExecutionContext => {
		const handler = jest.fn();
		class TestController {}

		return {
			getHandler: () => handler,
			getClass: () => TestController,
		} as unknown as ExecutionContext;
	};

	beforeEach(() => {
		mockCls = {
			get: jest.fn(),
			set: jest.fn(),
		};
		mockReflector = {
			getAllAndOverride: jest.fn().mockReturnValue(undefined),
		} as unknown as jest.Mocked<Reflector>;
		mockSpacesRepository = {
			findSpaceIdsByCategoryHierarchy: jest
				.fn()
				.mockResolvedValue([301n, 302n]),
		};
		next = {
			handle: jest.fn(() => of("ok")),
		};

		interceptor = new SpaceScopeInterceptor(
			mockCls as never,
			mockReflector,
			mockSpacesRepository as unknown as SpacesRepository,
		);
	});

	it("데코레이터가 없으면 현재 Space와 하위 Space scope를 사용해야 한다", async () => {
		mockCls.get.mockImplementation((key: string) => {
			if (key === CONTEXT_KEYS.TENANT) {
				return { id: 201n, spaceId: 301n };
			}
			if (key === CONTEXT_KEYS.TENANT_ID) return 201n;
			if (key === CONTEXT_KEYS.SPACE_ID) return 301n;
			return undefined;
		});

		await interceptor.intercept(createContext(), next);

		expect(
			mockSpacesRepository.findSpaceIdsByCategoryHierarchy,
		).toHaveBeenCalledWith(301n, SpaceResourceScope.WITH_DESCENDANTS);
		expect(mockCls.set).toHaveBeenCalledWith(CONTEXT_KEYS.EFFECTIVE_SPACE_IDS, [
			301n,
			302n,
		]);
		expect(next.handle).toHaveBeenCalled();
	});

	it("@WithAncestorSpaces metadata가 있으면 상위 Space scope를 사용해야 한다", async () => {
		mockReflector.getAllAndOverride.mockImplementation((key: string) => {
			if (key === SPACE_SCOPE_KEY) return SpaceResourceScope.WITH_ANCESTORS;
			return undefined;
		});
		mockCls.get.mockImplementation((key: string) => {
			if (key === CONTEXT_KEYS.TENANT) {
				return { id: 201n, spaceId: 301n };
			}
			if (key === CONTEXT_KEYS.TENANT_ID) return 201n;
			if (key === CONTEXT_KEYS.SPACE_ID) return 301n;
			return undefined;
		});

		await interceptor.intercept(createContext(), next);

		expect(
			mockSpacesRepository.findSpaceIdsByCategoryHierarchy,
		).toHaveBeenCalledWith(301n, SpaceResourceScope.WITH_ANCESTORS);
		expect(mockCls.set).toHaveBeenCalledWith(CONTEXT_KEYS.EFFECTIVE_SPACE_IDS, [
			301n,
			302n,
		]);
		expect(next.handle).toHaveBeenCalled();
	});

	it("@WithSpaceTree metadata가 있으면 상위와 하위 Space scope를 사용해야 한다", async () => {
		mockReflector.getAllAndOverride.mockImplementation((key: string) => {
			if (key === SPACE_SCOPE_KEY) return SpaceResourceScope.WITH_TREE;
			return undefined;
		});
		mockCls.get.mockImplementation((key: string) => {
			if (key === CONTEXT_KEYS.TENANT) {
				return { id: 201n, spaceId: 301n };
			}
			if (key === CONTEXT_KEYS.TENANT_ID) return 201n;
			if (key === CONTEXT_KEYS.SPACE_ID) return 301n;
			return undefined;
		});

		await interceptor.intercept(createContext(), next);

		expect(
			mockSpacesRepository.findSpaceIdsByCategoryHierarchy,
		).toHaveBeenCalledWith(301n, SpaceResourceScope.WITH_TREE);
		expect(mockCls.set).toHaveBeenCalledWith(CONTEXT_KEYS.EFFECTIVE_SPACE_IDS, [
			301n,
			302n,
		]);
		expect(next.handle).toHaveBeenCalled();
	});

	it("PLATFORM_ADMIN도 role 예외 없이 category scope를 사용해야 한다", async () => {
		mockCls.get.mockImplementation((key: string) => {
			if (key === CONTEXT_KEYS.TENANT) {
				return {
					id: 201n,
					spaceId: 301n,
					role: { name: "PLATFORM_ADMIN" },
				};
			}
			if (key === CONTEXT_KEYS.TENANT_ID) return 201n;
			if (key === CONTEXT_KEYS.SPACE_ID) return 301n;
			return undefined;
		});

		await interceptor.intercept(createContext(), next);

		expect(
			mockSpacesRepository.findSpaceIdsByCategoryHierarchy,
		).toHaveBeenCalledWith(301n, SpaceResourceScope.WITH_DESCENDANTS);
		expect(mockCls.set).toHaveBeenCalledWith(CONTEXT_KEYS.EFFECTIVE_SPACE_IDS, [
			301n,
			302n,
		]);
	});

	it("tenant.space.id로 파생된 Space를 우선 사용해야 한다", async () => {
		mockCls.get.mockImplementation((key: string) => {
			if (key === CONTEXT_KEYS.TENANT) {
				return {
					id: 201n,
					spaceId: undefined,
					space: { id: 303n },
				};
			}
			if (key === CONTEXT_KEYS.TENANT_ID) return 201n;
			if (key === CONTEXT_KEYS.SPACE_ID) return 304n;
			return undefined;
		});

		await interceptor.intercept(createContext(), next);

		expect(
			mockSpacesRepository.findSpaceIdsByCategoryHierarchy,
		).toHaveBeenCalledWith(303n, SpaceResourceScope.WITH_DESCENDANTS);
	});

	it("보호 라우트에서 x-tenant-id가 없으면 BadRequestException을 던져야 한다", async () => {
		mockCls.get.mockReturnValue(undefined);

		await expect(interceptor.intercept(createContext(), next)).rejects.toThrow(
			BadRequestException,
		);
	});

	it("보호 라우트에서 x-tenant-id에 매칭되는 tenant가 없으면 ForbiddenException을 던져야 한다", async () => {
		mockCls.get.mockImplementation((key: string) => {
			if (key === CONTEXT_KEYS.TENANT_ID) return 201n;
			if (key === CONTEXT_KEYS.SPACE_ID) return 301n;
			return undefined;
		});

		await expect(interceptor.intercept(createContext(), next)).rejects.toThrow(
			ForbiddenException,
		);
	});

	it("@SkipSpaceCheck 라우트는 tenant가 없어도 기존 scope 계산을 유지해야 한다", async () => {
		mockReflector.getAllAndOverride.mockImplementation((key: string) => {
			if (key === PUBLIC_ROUTE_KEY) return false;
			if (key === SKIP_SPACE_CHECK_KEY) return true;
			return undefined;
		});
		mockCls.get.mockImplementation((key: string) => {
			if (key === CONTEXT_KEYS.SPACE_ID) return 301n;
			return undefined;
		});

		await interceptor.intercept(createContext(), next);

		expect(
			mockSpacesRepository.findSpaceIdsByCategoryHierarchy,
		).toHaveBeenCalledWith(301n, SpaceResourceScope.WITH_DESCENDANTS);
		expect(mockCls.set).toHaveBeenCalledWith(CONTEXT_KEYS.EFFECTIVE_SPACE_IDS, [
			301n,
			302n,
		]);
		expect(next.handle).toHaveBeenCalled();
	});
});
