import {
	ApiAuth,
	ApiErrors,
	ApiResponseEntity,
	ResponseMessage,
} from "@cocrepo/decorator";
import {
	BookingFeedItemDto,
	CancelReservationDto,
	CreateReservationDto,
	QueryBookingFeedDto,
	QueryMyReservationsDto,
	ReservationDto,
} from "@cocrepo/dto";
import { ReservationFacade } from "@cocrepo/facade";
import {
	Body,
	Controller,
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

@ApiTags("RESERVATIONS")
@Controller()
export class ReservationsController {
	constructor(private readonly reservationFacade: ReservationFacade) {}

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
		return this.reservationFacade.getBookingFeed(query);
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
		return this.reservationFacade.create(dto);
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
		return this.reservationFacade.getMine(query);
	}

	@Patch("me/:reservationId/cancel")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		operationId: "cancelMyReservation",
		summary: "내 예약 취소",
		description: "현재 Space에서 로그인 사용자의 예약을 취소합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "reservationId",
		description: "예약 ID (UUID)",
		type: String,
	})
	@ApiBody({ type: CancelReservationDto, description: "예약 취소 정보" })
	@ApiErrors(400, 401, 403, 404, 409, 500)
	@ApiResponseEntity(ReservationDto, HttpStatus.OK)
	@ResponseMessage("예약 취소 성공")
	cancelMine(
		@Param("reservationId", ParseUUIDPipe) reservationId: string,
		@Body() dto: CancelReservationDto,
	) {
		return this.reservationFacade.cancel(reservationId, dto);
	}
}
