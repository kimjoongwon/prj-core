import { RoleCategories, RoleGroups, Roles } from "@cocrepo/decorator";
import { ResponseEntity } from "@cocrepo/entity";
import { RoleCategoryNames } from "@cocrepo/enum";
import { Roles as RolesEnum } from "@cocrepo/prisma";
import { Controller, Get, HttpStatus, Query, UseGuards } from "@nestjs/common";
import {
	RoleCategoryGuard,
	RoleGroupGuard,
	RolesGuard,
} from "@cocrepo/be-common";

/**
 * 테스트 전용 모킹 컨트롤러 - 테넌트 ID 주입 테스트용
 */
@Controller("api/v1/test-tenant")
export class TenantInjectionTestController {
	@Get("info")
	async getTenantInfo(@Query() query: any) {
		return new ResponseEntity(HttpStatus.OK, "테넌트 정보", {
			tenantId: query.tenantId,
		});
	}
}

/**
 * 테스트 전용 모킹 컨트롤러 - Guard 기능을 테스트하기 위한 용도
 * 실제 프로덕션 코드에는 포함되지 않음
 */
@Controller("api/v1/test-guards")
export class GuardTestController {
	// 기본적으로 인증 필요 (전역 JWT Guard 적용)
	@Get("debug-query")
	async debugQuery(@Query() query: any) {
		return new ResponseEntity(HttpStatus.OK, "Debug query parameters", {
			receivedQuery: query,
			hasTenantId: !!query.tenantId,
			tenantId: query.tenantId,
		});
	}

	// ==================== RoleCategoryGuard 테스트 ====================

	@Get("role-category/common")
	@UseGuards(RoleCategoryGuard)
	@RoleCategories([RoleCategoryNames.COMMON])
	async testRoleCategoryCommon() {
		return new ResponseEntity(HttpStatus.OK, "공통 카테고리 권한 테스트 성공", {
			message: "공통 카테고리 권한으로 접근 성공",
			categoryRequired: ["공통"],
		});
	}

	@Get("role-category/admin")
	@UseGuards(RoleCategoryGuard)
	@RoleCategories([RoleCategoryNames.ADMIN])
	async testRoleCategoryAdmin() {
		return new ResponseEntity(
			HttpStatus.OK,
			"관리자 카테고리 권한 테스트 성공",
			{
				message: "관리자 카테고리 권한으로 접근 성공",
				categoryRequired: ["관리자"],
			},
		);
	}

	@Get("role-category/user")
	@UseGuards(RoleCategoryGuard)
	@RoleCategories([RoleCategoryNames.USER])
	async testRoleCategoryUser() {
		return new ResponseEntity(
			HttpStatus.OK,
			"사용자 카테고리 권한 테스트 성공",
			{
				message: "사용자 카테고리 권한으로 접근 성공",
				categoryRequired: ["사용자"],
			},
		);
	}

	// ==================== RoleGroupGuard 테스트 ====================

	@Get("role-group/normal")
	@UseGuards(RoleGroupGuard)
	@RoleGroups(["일반"])
	async testRoleGroupNormal() {
		return new ResponseEntity(HttpStatus.OK, "일반 그룹 권한 테스트 성공", {
			message: "일반 그룹 권한으로 접근 성공",
			groupRequired: ["일반"],
		});
	}

	@Get("role-group/vip")
	@UseGuards(RoleGroupGuard)
	@RoleGroups(["VIP"])
	async testRoleGroupVIP() {
		return new ResponseEntity(HttpStatus.OK, "VIP 그룹 권한 테스트 성공", {
			message: "VIP 그룹 권한으로 접근 성공",
			groupRequired: ["VIP"],
		});
	}

	@Get("role-group/admin")
	@UseGuards(RoleGroupGuard)
	@RoleGroups(["관리자"])
	async testRoleGroupAdmin() {
		return new ResponseEntity(HttpStatus.OK, "관리자 그룹 권한 테스트 성공", {
			message: "관리자 그룹 권한으로 접근 성공",
			groupRequired: ["관리자"],
		});
	}

	// ==================== RolesGuard 테스트 ====================

	@Get("roles/user")
	@UseGuards(RolesGuard)
	@Roles([RolesEnum.USER])
	async testRolesUser() {
		return new ResponseEntity(HttpStatus.OK, "USER 역할 권한 테스트 성공", {
			message: "USER 역할로 접근 성공",
			roleRequired: ["USER"],
		});
	}

	@Get("roles/admin")
	@UseGuards(RolesGuard)
	@Roles([RolesEnum.ADMIN])
	async testRolesAdmin() {
		return new ResponseEntity(HttpStatus.OK, "ADMIN 역할 권한 테스트 성공", {
			message: "ADMIN 역할로 접근 성공",
			roleRequired: ["ADMIN"],
		});
	}

	@Get("roles/super-admin")
	@UseGuards(RolesGuard)
	@Roles([RolesEnum.SUPER_ADMIN])
	async testRolesSuperAdmin() {
		return new ResponseEntity(
			HttpStatus.OK,
			"SUPER_ADMIN 역할 권한 테스트 성공",
			{
				message: "SUPER_ADMIN 역할로 접근 성공",
				roleRequired: ["SUPER_ADMIN"],
			},
		);
	}

	// ==================== 복합 Guard 테스트 ====================

	@Get("combined/admin-category-and-role")
	@UseGuards(RoleCategoryGuard, RolesGuard)
	@RoleCategories([RoleCategoryNames.ADMIN])
	@Roles([RolesEnum.ADMIN])
	async testCombinedAdminCategoryAndRole() {
		return new ResponseEntity(HttpStatus.OK, "복합 권한 테스트 성공", {
			message: "관리자 카테고리 + ADMIN 역할 권한으로 접근 성공",
			categoryRequired: ["관리자"],
			roleRequired: ["ADMIN"],
		});
	}
}
