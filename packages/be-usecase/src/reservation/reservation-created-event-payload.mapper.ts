import type { Reservation } from "@cocrepo/entity";
import { type IntegrationUlid, parseIntegrationUlid } from "@cocrepo/type";

type ReservationCreatedPayload = {
	reservationId: IntegrationUlid;
	userSeq: IntegrationUlid;
	spaceSeq: IntegrationUlid;
	timelineSeq: IntegrationUlid;
	sessionSeq: IntegrationUlid;
	programSeq: IntegrationUlid;
	occurredAt: Date;
};

/**
 * 예약 생성 결과 엔티티의 공개 ULID만 사용해 integration event payload를 만듭니다.
 */
export function toReservationCreatedEventPayload(source: {
	reservation: Reservation;
	occurredAt: Date;
}): ReservationCreatedPayload {
	return {
		reservationId: requirePublicUlid(
			"reservationId",
			source.reservation.reservationId,
		),
		userSeq: requirePublicUlid("userSeq", source.reservation.user?.userSeq),
		spaceSeq: requirePublicUlid("spaceSeq", source.reservation.space?.spaceSeq),
		timelineSeq: requirePublicUlid(
			"timelineSeq",
			source.reservation.timeline?.timelineSeq,
		),
		sessionSeq: requirePublicUlid(
			"sessionSeq",
			source.reservation.session?.sessionSeq,
		),
		programSeq: requirePublicUlid(
			"programSeq",
			source.reservation.program?.programSeq,
		),
		occurredAt: source.occurredAt,
	};
}

function requirePublicUlid(fieldName: string, value?: string | null) {
	const parsed = value ? parseIntegrationUlid(value) : null;
	if (!parsed) {
		throw new Error(`ReservationCreatedEvent.${fieldName} public ULID missing`);
	}
	return parsed;
}
