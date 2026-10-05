import "reflect-metadata";

import { ReservationStatus } from "@cocrepo/prisma";
import { instanceToPlain, plainToInstance } from "class-transformer";
import { describe, expect, it } from "vitest";
import { prepareEntityResponseType } from "../mapped-types";
import { ProfileDto } from "../profile.dto";
import { ReservationDto } from "../reservations/reservation.dto";
import { UserDto } from "../user.dto";

describe("일반 REST DTO의 integration ULID 제외와 숫자 ID 직렬화", () => {
	it("Given user ULID와 decimal ID When DTO를 변환하면 Then 인스턴스는 bigint이고 JSON에서는 ULID가 제외된다", () => {
		prepareEntityResponseType(UserDto);
		const dto = plainToInstance(UserDto, {
			userId: "01J00000000000000000000000",
			spaceId: "1000",
			email: "user@example.com",
			name: "이름",
			phone: "010-0000-0000",
			password: "secret",
			failedLoginAttempts: 3,
			lockedUntil: null,
			isPermanentlyLocked: false,
			passwordChangedAt: null,
			lastLoginAt: null,
			lastLoginIp: null,
			isActive: true,
			currentTenantId: "500",
		});

		const plain = instanceToPlain(dto);

		expect(dto.spaceId).toBe(1000n);
		expect(dto.currentTenantId).toBe(500n);
		expect(plain).not.toHaveProperty("userId");
		expect(plain).toEqual(
			expect.objectContaining({
				spaceId: "1000",
				currentTenantId: "500",
			}),
		);
	});

	it("Given profile ULID와 decimal user ID When DTO를 변환하면 Then userId만 숫자 ID 문자열로 직렬화된다", () => {
		prepareEntityResponseType(ProfileDto);
		const dto = plainToInstance(ProfileDto, {
			profileId: "01J00000000000000000000001",
			avatarFileId: null,
			name: "프로필",
			nickname: "닉네임",
			address: "서울",
			userId: "600",
		});

		const plain = instanceToPlain(dto);

		expect(dto.userId).toBe(600n);
		expect(plain).not.toHaveProperty("profileId");
		expect(plain).toEqual(expect.objectContaining({ userId: "600" }));
	});

	it("Given reservation ULID와 decimal 관계 ID When DTO를 변환하면 Then 모든 숫자 ID가 JSON 문자열로 직렬화된다", () => {
		prepareEntityResponseType(ReservationDto);
		const dto = plainToInstance(ReservationDto, {
			reservationId: "01J00000000000000000000002",
			spaceId: "700",
			createdById: null,
			userId: "800",
			timelineId: "900",
			sessionId: "1000",
			programId: "1100",
			occurrenceStartAt: "2026-08-02T12:00:00.000Z",
			status: ReservationStatus.CONFIRMED,
			memo: null,
			idempotencyKey: "idem",
			waitlistPosition: null,
			confirmedAt: null,
			canceledAt: null,
			cancelReason: null,
		});

		const plain = instanceToPlain(dto);

		expect(dto.spaceId).toBe(700n);
		expect(dto.userId).toBe(800n);
		expect(dto.timelineId).toBe(900n);
		expect(dto.sessionId).toBe(1000n);
		expect(dto.programId).toBe(1100n);
		expect(plain).not.toHaveProperty("reservationId");
		expect(plain).toEqual(
			expect.objectContaining({
				spaceId: "700",
				userId: "800",
				timelineId: "900",
				sessionId: "1000",
				programId: "1100",
			}),
		);
	});
});
