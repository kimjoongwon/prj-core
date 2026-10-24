/**
 * 통합 식별자 공개 타입.
 */
import type { IntegrationUlid } from "@cocrepo/type";

/** 예약 공개 식별자 ULID */
export type ReservationId = IntegrationUlid;

/** 사용자 공개 식별자 ULID */
export type UserId = IntegrationUlid;

/** 스페이스 공개 식별자 ULID */
export type SpaceId = IntegrationUlid;

/** 타임라인 공개 식별자 ULID */
export type TimelineId = IntegrationUlid;

/** 세션 공개 식별자 ULID */
export type SessionId = IntegrationUlid;

/** 프로그램 공개 식별자 ULID */
export type ProgramId = IntegrationUlid;

/**
 * 예약 생성 이벤트 payload.
 *
 * 주의: 이 이벤트의 ID 값은 DB bigint 내부키가 아니라 이벤트 계약 기준 공개 ULID 문자열입니다.
 */
export interface ReservationCreatedEventPayload {
	/**
	 * 예약 공개 식별자 ULID.
	 * DB reservations.id(BigInt)는 내부 계약이며, 외부 이벤트 계약에서는 reservationId(ULID)만 사용합니다.
	 */
	reservationId: ReservationId;
	/**
	 * 사용자 공개 식별자 ULID.
	 * DB users.id(BigInt)는 내부 계약이며, 외부 이벤트 계약에서는 userSeq(ULID)만 사용합니다.
	 */
	userSeq: UserId;
	/**
	 * Space 공개 식별자 ULID.
	 * DB spaces.id(BigInt)는 내부 계약이며, 외부 이벤트 계약에서는 spaceSeq(ULID)만 사용합니다.
	 */
	spaceSeq: SpaceId;
	/**
	 * Timeline 공개 식별자 ULID.
	 * DB timelines.id(BigInt)는 내부 계약이며, 외부 이벤트 계약에서는 timelineSeq(ULID)만 사용합니다.
	 */
	timelineSeq: TimelineId;
	/**
	 * Session 공개 식별자 ULID.
	 * DB sessions.id(BigInt)는 내부 계약이며, 외부 이벤트 계약에서는 sessionSeq(ULID)만 사용합니다.
	 */
	sessionSeq: SessionId;
	/**
	 * Program 공개 식별자 ULID.
	 * DB programs.id(BigInt)는 내부 계약이며, 외부 이벤트 계약에서는 programSeq(ULID)만 사용합니다.
	 */
	programSeq: ProgramId;
	/** 이벤트 발생 시각 */
	occurredAt: Date;
}
