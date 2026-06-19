import {
	CreateReservationCheckoutCommand,
	CreateReservationCommand,
	GetMyReservationsQuery,
	GetReservationBookingFeedQuery,
	GetReservationCheckoutBootstrapQuery,
} from "@cocrepo/command";
import {
	ApiAuth,
	ApiErrors,
	ApiResponseEntity,
	ResponseMessage,
} from "@cocrepo/decorator";
import {
	BookingFeedItemDto,
	CreateReservationCheckoutDto,
	CreateReservationDto,
	QueryBookingFeedDto,
	QueryMyReservationsDto,
	QueryReservationCheckoutBootstrapDto,
	ReservationCheckoutBootstrapDto,
	ReservationCheckoutResultDto,
	ReservationDto,
} from "@cocrepo/dto";
import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Query,
} from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("RESERVATIONS")
@Controller()
export class ReservationsController {
	constructor(
		private readonly commandBus: CommandBus,
		private readonly queryBus: QueryBus,
	) {}

	@Get("booking-feed")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		operationId: "getReservationBookingFeed",
		summary: "예약 Booking Feed 조회",
		description:
			"현재 Space 기준으로 예약 가능한 프로그램 회차와 내 예약 상태를 조회합니다.",
	})
	@ApiAuth()
	@ApiErrors(401, 403, 500)
	@ApiResponseEntity(BookingFeedItemDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("예약 Booking Feed 조회 성공")
	getBookingFeed(@Query() query: QueryBookingFeedDto) {
		return this.queryBus.execute(
			new GetReservationBookingFeedQuery({
				dateFrom: query.dateFrom,
				dateTo: query.dateTo,
				programId: query.programId,
				search: query.search,
				skip: query.skip,
				take: query.take,
				timelineId: query.timelineId,
			}),
		);
	}

	@Get("checkout/bootstrap")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		operationId: "getReservationCheckoutBootstrap",
		summary: "예약 결제 Bootstrap 조회",
		description:
			"예약하려는 회차 기준으로 결제 가능한 과정과 placeholder 결제 수단을 조회합니다.",
	})
	@ApiAuth()
	@ApiErrors(400, 401, 403, 404, 409, 500)
	@ApiResponseEntity(ReservationCheckoutBootstrapDto, HttpStatus.OK)
	@ResponseMessage("예약 결제 Bootstrap 조회 성공")
	getCheckoutBootstrap(@Query() query: QueryReservationCheckoutBootstrapDto) {
		return this.queryBus.execute(
			new GetReservationCheckoutBootstrapQuery({
				occurrenceStartAt: query.occurrenceStartAt,
				programId: query.programId,
				sessionId: query.sessionId,
				timelineId: query.timelineId,
			}),
		);
	}

	@Post("checkout")
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		operationId: "createReservationCheckout",
		summary: "예약 결제 생성",
		description:
			"provider-neutral placeholder 결제로 Payment, Enrollment, CoursePass, Reservation을 생성합니다.",
	})
	@ApiAuth()
	@ApiBody({
		type: CreateReservationCheckoutDto,
		description: "예약 결제 생성 정보",
	})
	@ApiErrors(400, 401, 403, 404, 409, 500)
	@ApiResponseEntity(ReservationCheckoutResultDto, HttpStatus.CREATED)
	@ResponseMessage("예약 결제 생성 성공")
	createCheckout(@Body() dto: CreateReservationCheckoutDto) {
		return this.commandBus.execute(new CreateReservationCheckoutCommand(dto));
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		operationId: "createReservation",
		summary: "예약 생성",
		description:
			"현재 Space와 로그인 사용자를 기준으로 프로그램 회차 예약을 생성합니다.",
	})
	@ApiAuth()
	@ApiBody({ type: CreateReservationDto, description: "생성할 예약 정보" })
	@ApiErrors(400, 401, 403, 404, 409, 500)
	@ApiResponseEntity(ReservationDto, HttpStatus.CREATED)
	@ResponseMessage("예약 생성 성공")
	createReservation(@Body() dto: CreateReservationDto) {
		return this.commandBus.execute(new CreateReservationCommand(dto));
	}

	@Get("me")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		operationId: "getMyReservations",
		summary: "내 예약 목록 조회",
		description: "현재 Space에서 로그인 사용자의 예약 목록을 조회합니다.",
	})
	@ApiAuth()
	@ApiErrors(401, 403, 500)
	@ApiResponseEntity(ReservationDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("내 예약 목록 조회 성공")
	getMine(@Query() query: QueryMyReservationsDto) {
		return this.queryBus.execute(
			new GetMyReservationsQuery({
				from: query.from,
				skip: query.skip,
				status: query.status,
				take: query.take,
				to: query.to,
			}),
		);
	}
}
