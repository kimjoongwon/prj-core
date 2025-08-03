import { Controller, Get, HttpStatus, Query } from "@nestjs/common";
import { ResponseEntity } from "@shared/schema";
import { Auth } from "../../src/shared/decorator";
import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

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
	@Auth()
	@Get("debug-query")
	async debugQuery(@Query() query: any) {
		return new ResponseEntity(HttpStatus.OK, "Debug query parameters", {
			receivedQuery: query,
			hasTenantId: !!query.tenantId,
			tenantId: query.tenantId,
		});
	}

	@Auth({ injectTenant: false })
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
}
