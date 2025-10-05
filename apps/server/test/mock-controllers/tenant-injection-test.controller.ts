import { Controller, Get, HttpStatus, Query } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { ResponseEntity, RoleCategoryNames } from "@shared/schema";
import { IsString } from "class-validator";

// Auth decorator is currently commented out
// import { Auth } from "@shared/schema";

class TestQueryDto {
	@IsString()
	@ApiProperty({ required: false })
	testParam?: string;

	@IsString()
	@ApiProperty({ required: false })
	tenantId?: string;
}

/**
 * 테스트 전용 모킹 컨트롤러 - 테넌트 ID 주입 기능을 테스트하기 위한 용도
 * 실제 프로덕션 코드에는 포함되지 않음
 */
@Controller("api/v1/test-tenant-injection")
export class TenantInjectionTestController {
	// @Auth()
	@Get("debug-query")
	async debugQuery(@Query() query: any) {
		return new ResponseEntity(HttpStatus.OK, "Debug query parameters", {
			receivedQuery: query,
			hasTenantId: !!query.tenantId,
			tenantId: query.tenantId,
		});
	}

	// @Auth({ injectTenant: false })
	@Get("debug-query-no-injection")
	async debugQueryNoInjection(@Query() query: any) {
		return new ResponseEntity(
			HttpStatus.OK,
			"Debug query parameters without tenant injection",
			{
				receivedQuery: query,
				hasTenantId: !!query.tenantId,
				tenantId: query.tenantId,
			},
		);
	}

	// @Auth({ categories: [RoleCategoryNames.COMMON] })
	@Get("test-role-category-common")
	async testRoleCategoryCommon() {
		return new ResponseEntity(
			HttpStatus.OK,
			"Role category guard test - 공통 카테고리 접근 성공",
			{
				message: "공통 카테고리 권한으로 접근 성공",
				categoryRequired: ["공통"],
			},
		);
	}

	// @Auth({ categories: [RoleCategoryNames.ADMIN] })
	@Get("test-role-category-admin")
	async testRoleCategoryAdmin() {
		return new ResponseEntity(
			HttpStatus.OK,
			"Role category guard test - 관리자 카테고리 접근 성공",
			{
				message: "관리자 카테고리 권한으로 접근 성공",
				categoryRequired: ["관리자"],
			},
		);
	}

	// @Auth({ groups: ["일반"] })
	@Get("test-role-group-normal")
	async testRoleGroupNormal() {
		return new ResponseEntity(
			HttpStatus.OK,
			"Role group guard test - 일반 그룹 접근 성공",
			{
				message: "일반 그룹 권한으로 접근 성공",
				groupRequired: ["일반"],
			},
		);
	}

	// @Auth({ groups: ["VIP"] })
	@Get("test-role-group-vip")
	async testRoleGroupVIP() {
		return new ResponseEntity(
			HttpStatus.OK,
			"Role group guard test - VIP 그룹 접근 성공",
			{
				message: "VIP 그룹 권한으로 접근 성공",
				groupRequired: ["VIP"],
			},
		);
	}
}
