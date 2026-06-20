import { GetPaymentsQuery } from "@cocrepo/command";
import {
	ApiAuth,
	ApiErrors,
	ApiResponseEntity,
	ResponseMessage,
} from "@cocrepo/decorator";
import { PaymentDto, QueryPaymentDto } from "@cocrepo/dto";
import { Controller, Get, HttpCode, HttpStatus, Query } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("PAYMENTS")
@Controller()
export class PaymentsController {
	constructor(private readonly queryBus: QueryBus) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		operationId: "getPayments",
		summary: "결제 목록 조회",
		description:
			"현재 Space 기준으로 Course, Product 등 다양한 서비스 결제 원장을 조회합니다.",
	})
	@ApiAuth()
	@ApiErrors(401, 403, 500)
	@ApiResponseEntity(PaymentDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("결제 목록 조회 성공")
	getPayments(@Query() query: QueryPaymentDto) {
		return this.queryBus.execute(new GetPaymentsQuery(query));
	}
}
