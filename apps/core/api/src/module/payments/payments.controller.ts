import { PaymentApplicationService } from "@cocrepo/app";
import {
	ApiAuth,
	ApiErrors,
	ApiResponseEntity,
	ResponseMessage,
} from "@cocrepo/decorator";
import {
	CreatePaymentDto,
	CreateReservationPaymentCheckoutDto,
	PaymentDto,
	QueryPaymentDto,
	ReservationPaymentCheckoutDto,
	UpdatePaymentDto,
} from "@cocrepo/dto";
import { PaymentFacade } from "@cocrepo/facade";
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
	Query,
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";

@ApiTags("PAYMENTS")
@Controller()
export class PaymentsController {
	constructor(
		private readonly paymentFacade: PaymentFacade,
		private readonly paymentApplicationService: PaymentApplicationService,
	) {}

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
		return this.paymentFacade.getPayments(query);
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		operationId: "createPayment",
		summary: "결제 생성",
		description:
			"관리자 또는 결제 연동이 공통 결제 원장에 결제 대상과 참조를 기록합니다.",
	})
	@ApiAuth()
	@ApiBody({ type: CreatePaymentDto, description: "생성할 결제 정보" })
	@ApiErrors(400, 401, 403, 500)
	@ApiResponseEntity(PaymentDto, HttpStatus.CREATED)
	@ResponseMessage("결제 생성 성공")
	createPayment(@Body() dto: CreatePaymentDto) {
		return this.paymentApplicationService.createPayment(dto);
	}

	@Post("reservation-checkout")
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		operationId: "createReservationPaymentCheckout",
		summary: "예약 결제 체크아웃 생성",
		description:
			"현재 Space와 로그인 사용자를 기준으로 예약 전 수강권이 없는 사용자의 provider-neutral 결제 체크아웃을 생성합니다.",
	})
	@ApiAuth()
	@ApiBody({
		type: CreateReservationPaymentCheckoutDto,
		description: "예약 결제 체크아웃 정보",
	})
	@ApiErrors(400, 401, 403, 404, 409, 500)
	@ApiResponseEntity(ReservationPaymentCheckoutDto, HttpStatus.CREATED)
	@ResponseMessage("예약 결제 체크아웃 생성 성공")
	createReservationPaymentCheckout(
		@Body() dto: CreateReservationPaymentCheckoutDto,
	) {
		return this.paymentApplicationService.createReservationCheckout(dto);
	}

	@Get(":paymentId")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		operationId: "getPaymentById",
		summary: "결제 상세 조회",
		description:
			"특정 결제의 대상과 참조 리소스를 포함한 상세 정보를 조회합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "paymentId",
		description: "결제 ID (UUID)",
		type: String,
	})
	@ApiErrors(401, 403, 404, 500)
	@ApiResponseEntity(PaymentDto, HttpStatus.OK)
	@ResponseMessage("결제 조회 성공")
	getPaymentById(@Param("paymentId", ParseUUIDPipe) paymentId: string) {
		return this.paymentFacade.getPaymentById(paymentId);
	}

	@Patch(":paymentId")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		operationId: "updatePayment",
		summary: "결제 수정",
		description:
			"결제 상태, 제공자 식별자, 승인/취소 시각, 메모 등 결제 원장 정보를 수정합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "paymentId",
		description: "결제 ID (UUID)",
		type: String,
	})
	@ApiBody({ type: UpdatePaymentDto, description: "수정할 결제 정보" })
	@ApiErrors(400, 401, 403, 404, 500)
	@ApiResponseEntity(PaymentDto, HttpStatus.OK)
	@ResponseMessage("결제 수정 성공")
	updatePayment(
		@Param("paymentId", ParseUUIDPipe) paymentId: string,
		@Body() dto: UpdatePaymentDto,
	) {
		return this.paymentApplicationService.updatePayment(paymentId, dto);
	}

	@Delete(":paymentId")
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({
		operationId: "deletePayment",
		summary: "결제 삭제",
		description: "결제 원장을 소프트 삭제합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "paymentId",
		description: "결제 ID (UUID)",
		type: String,
	})
	@ApiErrors(401, 403, 404, 500)
	@ResponseMessage("결제 삭제 성공")
	async deletePayment(
		@Param("paymentId", ParseUUIDPipe) paymentId: string,
	): Promise<void> {
		await this.paymentApplicationService.deletePayment(paymentId);
	}
}
