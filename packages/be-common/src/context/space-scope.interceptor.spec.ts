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
				.mockResolvedValue(["space-1", "space-child"]),
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
				return { id: "tenant-1", spaceId: "space-1" };
			}
			if (key === CONTEXT_KEYS.TENANT_ID) return "tenant-1";
			if (key === CONTEXT_KEYS.SPACE_ID) return "space-1";
			return undefined;
		});

		await interceptor.intercept(createContext(), next);

		expect(
			mockSpacesRepository.findSpaceIdsByCategoryHierarchy,
		).toHaveBeenCalledWith("space-1", SpaceResourceScope.WITH_DESCENDANTS);
		expect(mockCls.set).toHaveBeenCalledWith(
			CONTEXT_KEYS.EFFECTIVE_SPACE_IDS,
			["space-1", "space-child"],
		);
		expect(next.handle).toHaveBeenCalled();
	});

	it("@WithAncestorSpaces metadata가 있으면 상위 Space scope를 사용해야 한다", async () => {
		mockReflector.getAllAndOverride.mockImplementation((key: string) => {
			if (key === SPACE_SCOPE_KEY) return SpaceResourceScope.WITH_ANCESTORS;
			return undefined;
		});
		mockCls.get.mockImplementation((key: string) => {
			if (key === CONTEXT_KEYS.TENANT) {
				return { id: "tenant-1", spaceId: "space-1" };
			}
			if (key === CONTEXT_KEYS.TENANT_ID) return "tenant-1";
			if (key === CONTEXT_KEYS.SPACE_ID) return "space-1";
			return undefined;
		});

		await interceptor.intercept(createContext(), next);

		expect(
			mockSpacesRepository.findSpaceIdsByCategoryHierarchy,
		).toHaveBeenCalledWith("space-1", SpaceResourceScope.WITH_ANCESTORS);
		expect(mockCls.set).toHaveBeenCalledWith(CONTEXT_KEYS.EFFECTIVE_SPACE_IDS, [
			"space-1",
			"space-child",
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
				return { id: "tenant-1", spaceId: "space-1" };
			}
			if (key === CONTEXT_KEYS.TENANT_ID) return "tenant-1";
			if (key === CONTEXT_KEYS.SPACE_ID) return "space-1";
			return undefined;
		});

		await interceptor.intercept(createContext(), next);

		expect(
			mockSpacesRepository.findSpaceIdsByCategoryHierarchy,
		).toHaveBeenCalledWith("space-1", SpaceResourceScope.WITH_TREE);
		expect(mockCls.set).toHaveBeenCalledWith(CONTEXT_KEYS.EFFECTIVE_SPACE_IDS, [
			"space-1",
			"space-child",
		]);
		expect(next.handle).toHaveBeenCalled();
	});

	it("PLATFORM_ADMIN도 role 예외 없이 category scope를 사용해야 한다", async () => {
		mockCls.get.mockImplementation((key: string) => {
			if (key === CONTEXT_KEYS.TENANT) {
				return {
					id: "tenant-1",
					spaceId: "space-1",
					role: { name: "PLATFORM_ADMIN" },
				};
			}
			if (key === CONTEXT_KEYS.TENANT_ID) return "tenant-1";
			if (key === CONTEXT_KEYS.SPACE_ID) return "space-1";
			return undefined;
		});

		await interceptor.intercept(createContext(), next);

		expect(
			mockSpacesRepository.findSpaceIdsByCategoryHierarchy,
		).toHaveBeenCalledWith("space-1", SpaceResourceScope.WITH_DESCENDANTS);
		expect(mockCls.set).toHaveBeenCalledWith(
			CONTEXT_KEYS.EFFECTIVE_SPACE_IDS,
			["space-1", "space-child"],
		);
	});

	it("tenant.space.id로 파생된 Space를 우선 사용해야 한다", async () => {
		mockCls.get.mockImplementation((key: string) => {
			if (key === CONTEXT_KEYS.TENANT) {
				return {
					id: "tenant-1",
					spaceId: undefined,
					space: { id: "space-from-tenant" },
				};
			}
			if (key === CONTEXT_KEYS.TENANT_ID) return "tenant-1";
			if (key === CONTEXT_KEYS.SPACE_ID) return "space-from-cls";
			return undefined;
		});

		await interceptor.intercept(createContext(), next);

		expect(
			mockSpacesRepository.findSpaceIdsByCategoryHierarchy,
		).toHaveBeenCalledWith(
			"space-from-tenant",
			SpaceResourceScope.WITH_DESCENDANTS,
		);
	});

	it("보호 라우트에서 x-tenant-id가 없으면 BadRequestException을 던져야 한다", async () => {
		mockCls.get.mockReturnValue(undefined);

		await expect(interceptor.intercept(createContext(), next)).rejects.toThrow(
			BadRequestException,
		);
	});

	it("보호 라우트에서 x-tenant-id에 매칭되는 tenant가 없으면 ForbiddenException을 던져야 한다", async () => {
		mockCls.get.mockImplementation((key: string) => {
			if (key === CONTEXT_KEYS.TENANT_ID) return "tenant-1";
			if (key === CONTEXT_KEYS.SPACE_ID) return "space-1";
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
			if (key === CONTEXT_KEYS.SPACE_ID) return "space-1";
			return undefined;
		});

		await interceptor.intercept(createContext(), next);

		expect(
			mockSpacesRepository.findSpaceIdsByCategoryHierarchy,
		).toHaveBeenCalledWith("space-1", SpaceResourceScope.WITH_DESCENDANTS);
		expect(mockCls.set).toHaveBeenCalledWith(CONTEXT_KEYS.EFFECTIVE_SPACE_IDS, [
			"space-1",
			"space-child",
		]);
		expect(next.handle).toHaveBeenCalled();
	});
});
