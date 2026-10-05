import type { Reservation } from "@cocrepo/entity";
import { type IntegrationUlid, parseIntegrationUlid } from "@cocrepo/type";

type ReservationCreatedPayload = {
	reservationId: IntegrationUlid;
	userId: IntegrationUlid;
	spaceId: IntegrationUlid;
	timelineId: IntegrationUlid;
	sessionId: IntegrationUlid;
	programId: IntegrationUlid;
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
		userId: requirePublicUlid("userId", source.reservation.user?.userId),
		spaceId: requirePublicUlid("spaceId", source.reservation.space?.spaceId),
		timelineId: requirePublicUlid(
			"timelineId",
			source.reservation.timeline?.timelineId,
		),
		sessionId: requirePublicUlid(
			"sessionId",
			source.reservation.session?.sessionId,
		),
		programId: requirePublicUlid(
			"programId",
			source.reservation.program?.programId,
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
