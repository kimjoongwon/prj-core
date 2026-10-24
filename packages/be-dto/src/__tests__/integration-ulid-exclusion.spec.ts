import "reflect-metadata";

import { ReservationStatus } from "@cocrepo/prisma";
import { instanceToPlain, plainToInstance } from "class-transformer";
import { describe, expect, it } from "vitest";
import { prepareEntityResponseType } from "../mapped-types";
import { ProfileDto } from "../profile.dto";
import { ReservationDto } from "../reservations/reservation.dto";
import { UserDto } from "../user.dto";

describe("일반 REST DTO의 공개 ULID 노출과 내부 seq 미노출", () => {
	it("Given user ULID When DTO를 변환하면 Then 공개 id(ULID)만 노출하고 내부 seq는 노출하지 않는다", () => {
		prepareEntityResponseType(UserDto);
		const dto = plainToInstance(UserDto, {
			id: "01J00000000000000000000000",
			seq: "1000",
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
			currentTenantSeq: "500",
		});

		const plain = instanceToPlain(dto);

		expect(plain).not.toHaveProperty("seq");
		expect(plain).not.toHaveProperty("spaceSeq");
	});

	it("Given profile When DTO를 변환하면 Then user seq는 노출하지 않는다", () => {
		prepareEntityResponseType(ProfileDto);
		const dto = plainToInstance(ProfileDto, {
			id: "01J00000000000000000000001",
			avatarFileId: null,
			name: "프로필",
			nickname: "닉네임",
			address: "서울",
			userSeq: "600",
		});

		const plain = instanceToPlain(dto);

		expect(plain).not.toHaveProperty("seq");
		expect(plain).not.toHaveProperty("userSeq");
	});

	it("Given reservation When DTO를 변환하면 Then 관계 seq는 통신선에 노출하지 않는다", () => {
		prepareEntityResponseType(ReservationDto);
		const dto = plainToInstance(ReservationDto, {
			id: "01J00000000000000000000002",
			seq: "700",
			createdBySeq: null,
			occurrenceStartAt: new Date("2026-08-02T12:00:00.000Z"),
			status: ReservationStatus.CONFIRMED,
			memo: null,
			idempotencyKey: "idem",
			waitlistPosition: null,
			confirmedAt: null,
			canceledAt: null,
			cancelReason: null,
		});

		const plain = instanceToPlain(dto);

		expect(plain).not.toHaveProperty("spaceSeq");
		expect(plain).not.toHaveProperty("userSeq");
		expect(plain).not.toHaveProperty("timelineSeq");
		expect(plain).not.toHaveProperty("sessionSeq");
		expect(plain).not.toHaveProperty("programSeq");
		expect(plain).toEqual(
			expect.objectContaining({
				id: "01J00000000000000000000002",
				occurrenceStartAt: new Date("2026-08-02T12:00:00.000Z"),
				status: ReservationStatus.CONFIRMED,
			}),
		);
	});
});
