import { CONTEXT_KEYS } from "@cocrepo/constant";
import { PUBLIC_ROUTE_KEY, SKIP_SPACE_CHECK_KEY } from "@cocrepo/decorator";
import {
	BadRequestException,
	type CallHandler,
	type ExecutionContext,
	ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { of } from "rxjs";
import { SpaceScopeInterceptor } from "./space-scope.interceptor";

describe("SpaceScopeInterceptor", () => {
	let interceptor: SpaceScopeInterceptor;
	let mockCls: { get: jest.Mock; set: jest.Mock };
	let mockReflector: jest.Mocked<Reflector>;
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
			getAllAndOverride: jest.fn().mockReturnValue(false),
		} as unknown as jest.Mocked<Reflector>;
		next = {
			handle: jest.fn(() => of("ok")),
		};

		interceptor = new SpaceScopeInterceptor(mockCls as never, mockReflector);
	});

	it("현재 tenant role이 PLATFORM_ADMIN이면 전체 조회 scope를 열어야 한다", () => {
		mockCls.get.mockImplementation((key: string) => {
			if (key === CONTEXT_KEYS.TENANT) {
				return { id: "tenant-1", role: { name: "PLATFORM_ADMIN" } };
			}
			if (key === CONTEXT_KEYS.SPACE_ID) return "space-1";
			return undefined;
		});

		interceptor.intercept(createContext(), next);

		expect(mockCls.set).toHaveBeenCalledWith(
			CONTEXT_KEYS.EFFECTIVE_SPACE_IDS,
			undefined,
		);
		expect(next.handle).toHaveBeenCalled();
	});

	it("현재 tenant role이 PLATFORM_ADMIN이 아니면 x-tenant-id 한 개로 scope를 고정해야 한다", () => {
		mockCls.get.mockImplementation((key: string) => {
			if (key === CONTEXT_KEYS.TENANT) {
				return { id: "tenant-1", role: { name: "COMPANY_MANAGER" } };
			}
			if (key === CONTEXT_KEYS.SPACE_ID) return "space-1";
			return undefined;
		});

		interceptor.intercept(createContext(), next);

		expect(mockCls.set).toHaveBeenCalledWith(CONTEXT_KEYS.EFFECTIVE_SPACE_IDS, [
			"space-1",
		]);
		expect(next.handle).toHaveBeenCalled();
	});

	it("현재 tenant role이 PLATFORM_ADMIN이 아니면 tenant.space.id로 scope를 고정해야 한다", () => {
		mockCls.get.mockImplementation((key: string) => {
			if (key === CONTEXT_KEYS.TENANT) {
				return {
					id: "tenant-1",
					spaceId: undefined,
					space: { id: "space-1" },
					role: { name: "COMPANY_MANAGER" },
				};
			}
			if (key === CONTEXT_KEYS.SPACE_ID) return "space-1";
			return undefined;
		});

		interceptor.intercept(createContext(), next);

		expect(mockCls.set).toHaveBeenCalledWith(CONTEXT_KEYS.EFFECTIVE_SPACE_IDS, [
			"space-1",
		]);
		expect(next.handle).toHaveBeenCalled();
	});

	it("보호 라우트에서 x-tenant-id가 없으면 BadRequestException을 던져야 한다", () => {
		mockCls.get.mockReturnValue(undefined);

		expect(() => interceptor.intercept(createContext(), next)).toThrow(
			BadRequestException,
		);
	});

	it("보호 라우트에서 x-tenant-id에 매칭되는 tenant가 없으면 ForbiddenException을 던져야 한다", () => {
		mockCls.get.mockImplementation((key: string) => {
			if (key === CONTEXT_KEYS.SPACE_ID) return "space-1";
			return undefined;
		});

		expect(() => interceptor.intercept(createContext(), next)).toThrow(
			ForbiddenException,
		);
	});

	it("@SkipSpaceCheck 라우트는 tenant가 없어도 기존 scope 계산을 유지해야 한다", () => {
		mockReflector.getAllAndOverride.mockImplementation((key: string) => {
			if (key === PUBLIC_ROUTE_KEY) return false;
			if (key === SKIP_SPACE_CHECK_KEY) return true;
			return false;
		});
		mockCls.get.mockImplementation((key: string) => {
			if (key === CONTEXT_KEYS.SPACE_ID) return "space-1";
			return undefined;
		});

		interceptor.intercept(createContext(), next);

		expect(mockCls.set).toHaveBeenCalledWith(CONTEXT_KEYS.EFFECTIVE_SPACE_IDS, [
			"space-1",
		]);
		expect(next.handle).toHaveBeenCalled();
	});
});
