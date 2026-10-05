import { SYSTEM_ROLES } from "@cocrepo/constant";
import { PUBLIC_ROUTE_KEY, ROLES_KEY } from "@cocrepo/decorator";
import { JwtAuthGuard } from "@cocrepo/be-common";
import { UnauthorizedException, type ExecutionContext } from "@nestjs/common";
import { GUARDS_METADATA } from "@nestjs/common/constants";
import type { Reflector } from "@nestjs/core";
import type { TokenStorageService } from "@cocrepo/service";
import type { ClsService } from "nestjs-cls";
import { RolesGuard } from "@cocrepo/be-common";
import { SubjectsController } from "./subjects.controller";

describe("SubjectsController", () => {
	it.each(["getSubjects", "getSubjectFields", "getSubjectById"] as const)(
		"%s는 비인증 요청에 공개되지 않고 PLATFORM_ADMIN 권한을 요구한다",
		async (methodName) => {
			// Given
			const descriptor = Object.getOwnPropertyDescriptor(
				SubjectsController.prototype,
				methodName,
			);
			const handler = descriptor?.value;
			if (!handler) {
				throw new Error(`${methodName} handler를 찾을 수 없습니다`);
			}

			const reflector = {
				getAllAndOverride: jest.fn().mockReturnValue(undefined),
			} as unknown as Reflector;
			const tokenStorageService = {
				isBlacklisted: jest.fn(),
			} as unknown as TokenStorageService;
			const cls = {
				get: jest.fn().mockReturnValue(undefined),
			} as unknown as ClsService;
			const jwtAuthGuard = new JwtAuthGuard(
				reflector,
				tokenStorageService,
				cls,
			);
			const context = {
				switchToHttp: () => ({ getRequest: () => ({}) }),
				getHandler: () => handler,
				getClass: () => SubjectsController,
			} as unknown as ExecutionContext;

			// Then
			expect(Reflect.getMetadata(PUBLIC_ROUTE_KEY, handler)).toBeUndefined();
			expect(Reflect.getMetadata(GUARDS_METADATA, handler)).toContain(RolesGuard);
			expect(Reflect.getMetadata(ROLES_KEY, handler)).toEqual([
				SYSTEM_ROLES.PLATFORM_ADMIN,
			]);
			await expect(jwtAuthGuard.canActivate(context)).rejects.toThrow(
				UnauthorizedException,
			);
		},
	);
});
