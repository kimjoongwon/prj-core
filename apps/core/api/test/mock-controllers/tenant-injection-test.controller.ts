import {
	RoleCategoryGuard,
	RoleGroupGuard,
	RolesGuard,
} from "@cocrepo/be-common";
import { SYSTEM_ROLES } from "@cocrepo/constant";
import { RoleCategories, RoleGroups, Roles } from "@cocrepo/decorator";
import { ResponseEntity } from "@cocrepo/entity";
import { RoleCategoryName } from "@cocrepo/enum";
import { Controller, Get, HttpStatus, Query, UseGuards } from "@nestjs/common";

/**
 * 테스트 전용 모킹 컨트롤러 - 테넌트 ID 주입 테스트용
 */
@Controller("api/v1/test-tenant")
export class TenantInjectionTestController {
	@Get("info")
	async getTenantInfo(@Query() query: Record<string, unknown>) {
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
	async debugQuery(@Query() query: Record<string, unknown>) {
		return new ResponseEntity(HttpStatus.OK, "Debug query parameters", {
			receivedQuery: query,
			hasTenantId: !!query.tenantId,
			tenantId: query.tenantId,
		});
	}

	// ==================== RoleCategoryGuard 테스트 ====================

	@Get("role-category/shared")
	@UseGuards(RoleCategoryGuard)
	@RoleCategories([RoleCategoryName.SHARED])
	async testRoleCategoryShared() {
		return new ResponseEntity(HttpStatus.OK, "공유 카테고리 권한 테스트 성공", {
			message: "공유 카테고리 권한으로 접근 성공",
			categoryRequired: ["공유"],
		});
	}

	@Get("role-category/workspace")
	@UseGuards(RoleCategoryGuard)
	@RoleCategories([RoleCategoryName.WORKSPACE])
	async testRoleCategoryWorkspace() {
		return new ResponseEntity(
			HttpStatus.OK,
			"워크스페이스 카테고리 권한 테스트 성공",
			{
				message: "워크스페이스 카테고리 권한으로 접근 성공",
				categoryRequired: ["워크스페이스"],
			},
		);
	}

	@Get("role-category/public")
	@UseGuards(RoleCategoryGuard)
	@RoleCategories([RoleCategoryName.PUBLIC])
	async testRoleCategoryPublic() {
		return new ResponseEntity(HttpStatus.OK, "공개 카테고리 권한 테스트 성공", {
			message: "공개 카테고리 권한으로 접근 성공",
			categoryRequired: ["공개"],
		});
	}

	// ==================== RoleGroupGuard 테스트 ====================

	@Get("role-group/standard")
	@UseGuards(RoleGroupGuard)
	@RoleGroups(["일반"])
	async testRoleGroupStandard() {
		return new ResponseEntity(HttpStatus.OK, "일반 그룹 권한 테스트 성공", {
			message: "일반 그룹 권한으로 접근 성공",
			groupRequired: ["일반"],
		});
	}

	@Get("role-group/premium")
	@UseGuards(RoleGroupGuard)
	@RoleGroups(["프리미엄"])
	async testRoleGroupPremium() {
		return new ResponseEntity(HttpStatus.OK, "프리미엄 그룹 권한 테스트 성공", {
			message: "프리미엄 그룹 권한으로 접근 성공",
			groupRequired: ["프리미엄"],
		});
	}

	@Get("role-group/trusted")
	@UseGuards(RoleGroupGuard)
	@RoleGroups(["신뢰"])
	async testRoleGroupTrusted() {
		return new ResponseEntity(HttpStatus.OK, "신뢰 그룹 권한 테스트 성공", {
			message: "신뢰 그룹 권한으로 접근 성공",
			groupRequired: ["신뢰"],
		});
	}

	// ==================== RolesGuard 테스트 ====================

	@Get("roles/member")
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.MEMBER])
	async testRolesMember() {
		return new ResponseEntity(HttpStatus.OK, "MEMBER 역할 권한 테스트 성공", {
			message: "MEMBER 역할로 접근 성공",
			roleRequired: ["MEMBER"],
		});
	}

	@Get("roles/company-manager")
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.COMPANY_MANAGER])
	async testRolesCompanyManager() {
		return new ResponseEntity(HttpStatus.OK, "COMPANY_MANAGER 역할 권한 테스트 성공", {
			message: "COMPANY_MANAGER 역할로 접근 성공",
			roleRequired: ["COMPANY_MANAGER"],
		});
	}

	@Get("roles/platform-admin")
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.PLATFORM_ADMIN])
	async testRolesPlatformAdmin() {
		return new ResponseEntity(
			HttpStatus.OK,
			"PLATFORM_ADMIN 역할 권한 테스트 성공",
			{
				message: "PLATFORM_ADMIN 역할로 접근 성공",
				roleRequired: ["PLATFORM_ADMIN"],
			},
		);
	}

	// ==================== 복합 Guard 테스트 ====================

	@Get("combined/workspace-category-and-role")
	@UseGuards(RoleCategoryGuard, RolesGuard)
	@RoleCategories([RoleCategoryName.WORKSPACE])
	@Roles([SYSTEM_ROLES.COMPANY_MANAGER])
	async testCombinedWorkspaceCategoryAndRole() {
		return new ResponseEntity(HttpStatus.OK, "복합 권한 테스트 성공", {
			message: "워크스페이스 카테고리 + COMPANY_MANAGER 역할 권한으로 접근 성공",
			categoryRequired: ["워크스페이스"],
			roleRequired: ["COMPANY_MANAGER"],
		});
	}
}
