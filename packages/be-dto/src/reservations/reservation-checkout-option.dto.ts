import { NumberField, StringField, UUIDField } from "@cocrepo/decorator";

export class ReservationCheckoutOptionDto {
	@UUIDField({ description: "코스 ID" })
	courseId!: string;

	@UUIDField({ description: "코스 개설 ID" })
	courseOfferingId!: string;

	@UUIDField({ description: "사용할 Timeline ID" })
	timelineId!: string;

	@StringField({ description: "코스명" })
	courseName!: string;

	@StringField({ description: "개설명" })
	courseOfferingName!: string;

	@NumberField({ description: "수강 기간(개월)", int: true, min: 1 })
	durationMonths!: number;

	@NumberField({ description: "결제 금액", int: true, min: 0 })
	priceAmount!: number;

	@StringField({
		description: "통화 코드",
		minLength: 3,
		maxLength: 3,
		toUpperCase: true,
	})
	currency!: string;

	@NumberField({ description: "예상 예약 가능 횟수", int: true, min: 0 })
	reservationLimit!: number;
}
