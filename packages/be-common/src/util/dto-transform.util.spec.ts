import { ClassField, StringField } from "@cocrepo/decorator/field";
import { EntityResponseType } from "@cocrepo/dto";
import { Exclude, Expose, instanceToPlain, Type } from "class-transformer";
import { transformToDto } from "./dto-transform.util";

class ResponseRelationEntity {
	@StringField() name!: string;
	password!: string;
	relationId!: string;
}
class ResponseRelationDto extends EntityResponseType(ResponseRelationEntity, {
	pick: ["name"],
}) {}
class ResponseOwnerEntity {
	@StringField() name!: string;
	password!: string;
	ownerId!: string;
	@ClassField(() => ResponseRelationEntity, { each: true, required: false })
	relations?: ResponseRelationEntity[];
	privateRelation?: ResponseRelationEntity;
}
class ResponseOwnerDto extends EntityResponseType(ResponseOwnerEntity, {
	pick: ["name", "relations"],
	relations: { relations: () => ResponseRelationDto },
	extraFields: ["displayLabel"],
}) {
	declare relations?: ResponseRelationDto[];
	@StringField() displayLabel!: string;
}
class ApiProjectionBase {
	@StringField() inheritedLabel!: string;
}
class ApiProjection extends ApiProjectionBase {
	@StringField() label!: string;
	@Expose()
	@Type(() => Date)
	publishedAt!: Date;
	@StringField()
	@Exclude()
	privateNote!: string;
}
class ProjectionOwnerEntity {
	@ClassField(() => ApiProjection) summary!: ApiProjection;
}
class ProjectionOwnerDto extends EntityResponseType(ProjectionOwnerEntity, {
	pick: ["summary"],
	relations: { summary: () => ApiProjection },
}) {
	declare summary: ApiProjection;
}

describe("transformToDto Entity 응답 경계", () => {
	it("실제 변환 함수가 concrete DTO 루트와 중첩의 unknown·password·ULID·비공개 관계를 제거한다", () => {
		const response = transformToDto(ResponseOwnerDto, {
			name: "관리자",
			displayLabel: "공개 이름",
			password: "stored-hash",
			ownerId: "01ARZ3NDEKTSV4RRFFQ69G5FAV",
			unknown: "internal",
			privateRelation: { name: "비공개" },
			relations: [
				{ name: "공개", password: "hash", relationId: "ULID", unknown: true },
			],
		});
		expect(response).toBeInstanceOf(ResponseOwnerDto);
		expect(response).not.toHaveProperty("password");
		expect(response).not.toHaveProperty("ownerId");
		expect(response).not.toHaveProperty("unknown");
		expect(response).not.toHaveProperty("privateRelation");
		expect(response).toHaveProperty(
			"relations.0",
			expect.any(ResponseRelationDto),
		);
		expect(response).not.toHaveProperty("relations.0.password");
		expect(response).not.toHaveProperty("relations.0.relationId");
		expect(response).not.toHaveProperty("relations.0.unknown");
		expect(instanceToPlain(response)).toEqual({
			name: "관리자",
			displayLabel: "공개 이름",
			relations: [{ name: "공개" }],
		});
	});

	it("배열 변환과 추가 제외 필드도 같은 공개 계약을 적용한다", () => {
		const responses = transformToDto(
			ResponseOwnerDto,
			[
				{
					name: "관리자",
					displayLabel: "숨김",
					password: "hash",
					relations: [],
				},
			],
			{ isArray: true, excludeFields: ["displayLabel"] },
		);
		expect(instanceToPlain(responses)).toEqual([
			{ name: "관리자", relations: [] },
		]);
	});

	it("Entity가 없는 API 관계의 Swagger 상속 필드와 Expose·Type 전용 필드는 유지한다", () => {
		const response = transformToDto(ProjectionOwnerDto, {
			summary: {
				label: "요약",
				inheritedLabel: "상속",
				publishedAt: "2026-09-05T00:00:00.000Z",
				privateNote: "secret",
				unknown: true,
			},
		});
		expect(response).toHaveProperty("summary", expect.any(ApiProjection));
		expect(response).toHaveProperty("summary.publishedAt", expect.any(Date));
		expect(instanceToPlain(response)).toEqual({
			summary: {
				label: "요약",
				inheritedLabel: "상속",
				publishedAt: new Date("2026-09-05T00:00:00.000Z"),
			},
		});
	});

	it("Entity 응답을 포함한 wrapper도 공개 token·user만 남기고 임의 필드를 제거한다", () => {
		class WrappedUserEntity {
			@StringField() name!: string;
			password!: string;
			userId!: string;
		}
		class WrappedUserDto extends EntityResponseType(WrappedUserEntity, {
			pick: ["name"],
		}) {}
		class OrdinaryWrapperDto {
			@StringField() token!: string;
			@ClassField(() => WrappedUserDto) user!: WrappedUserDto;
		}
		const response = transformToDto(OrdinaryWrapperDto, {
			token: "access-token",
			unknown: "internal",
			password: "wrapper-secret",
			user: {
				name: "관리자",
				password: "hash",
				userId: "ULID",
				relations: [],
			},
		});
		expect(response).toHaveProperty("token", "access-token");
		expect(response).not.toHaveProperty("unknown");
		expect(response).not.toHaveProperty("password");
		expect(response).toHaveProperty("user", expect.any(WrappedUserDto));
		expect(response).not.toHaveProperty("user.password");
		expect(response).not.toHaveProperty("user.userId");
	});

	it("Entity 응답 graph가 없는 일반 DTO의 기존 변환 동작은 유지한다", () => {
		class OrdinaryDto {
			@StringField() name!: string;
		}
		const response = transformToDto(OrdinaryDto, {
			name: "기존 DTO",
			legacyExtra: "기존 일반 DTO 계약",
		});
		expect(response).toHaveProperty("name", "기존 DTO");
		expect(response).toHaveProperty("legacyExtra", "기존 일반 DTO 계약");
	});
});
