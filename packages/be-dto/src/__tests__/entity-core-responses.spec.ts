import "reflect-metadata";
import { hydrateEntity, User } from "@cocrepo/entity";
import type { Type } from "@nestjs/common";
import { generateSchema, type SchemaObject } from "@nestjs/swagger";
import { instanceToPlain, plainToInstance } from "class-transformer";
import { describe, expect, it } from "vitest";
import { AbilityDto } from "../ability/ability.dto";
import { AbilitySummaryDto } from "../ability-summary.dto";
import { ActionDto } from "../action.dto";
import { ActivityDto } from "../activity.dto";
import { AuthAuditLogDto } from "../auth-audit-log.dto";
import { CategoryDto } from "../category.dto";
import { CompanyDto } from "../company.dto";
import { ExerciseDto } from "../exercise.dto";
import { FitnessCenterDto } from "../fitness-center.dto";
import { GroupDto } from "../group.dto";
import { prepareEntityResponseType } from "../mapped-types";
import { PasswordHistoryDto } from "../password-history.dto";
import { ProfileDto } from "../profile.dto";
import { ProgramDto } from "../program.dto";
import { ProgramActivityDto } from "../program-activity.dto";
import { RoleDto } from "../role.dto";
import { RoleAssociationDto } from "../role-association.dto";
import { RoleClassificationDto } from "../role-classification.dto";
import { RoutineDto } from "../routine.dto";
import { SecurityPolicyDto } from "../security-policy.dto";
import { SessionDto } from "../session.dto";
import { SpaceDto } from "../space.dto";
import { SpaceAssociationDto } from "../space-association.dto";
import { SpaceClassificationDto } from "../space-classification.dto";
import { SubjectDto } from "../subject/subject.dto";
import { SubjectSummaryDto } from "../subject-summary.dto";
import { TaskDto } from "../task.dto";
import { TemplateDto } from "../template/template.dto";
import { TemplateVariableDto } from "../template/template-variable.dto";
import { TenantDto } from "../tenant.dto";
import { TimelineDto } from "../timeline.dto";
import { UserDto } from "../user.dto";
import { UserAssociationDto } from "../user-association.dto";
import { UserClassificationDto } from "../user-classification.dto";
import { WhitelistEntryDto } from "../whitelist-entry.dto";

const originalResponseContracts = [
	{
		dto: ActionDto,
		fields: [
			"id",
			"createdAt",
			"updatedAt",
			"removedAt",
			"name",
			"displayName",
			"description",
			"group",
			"order",
		],
		required: ["id", "createdAt", "updatedAt", "removedAt", "name", "order"],
	},
	{
		dto: ActivityDto,
		fields: [
			"id",
			"createdAt",
			"updatedAt",
			"removedAt",
			"routineSeq",
			"taskSeq",
			"order",
			"repetitions",
			"restTime",
			"notes",
			"routine",
			"task",
		],
		required: [
			"id",
			"createdAt",
			"updatedAt",
			"removedAt",
			"routineSeq",
			"taskSeq",
			"order",
			"repetitions",
			"restTime",
			"routine",
			"task",
		],
	},
	{
		dto: AuthAuditLogDto,
		fields: [
			"id",
			"createdAt",
			"email",
			"userSeq",
			"result",
			"failureReason",
			"ipAddress",
			"userAgent",
			"clientId",
		],
		required: ["id", "createdAt", "email", "result", "ipAddress"],
	},
	{
		dto: CategoryDto,
		fields: [
			"id",
			"createdAt",
			"updatedAt",
			"removedAt",
			"spaceSeq",
			"createdBySeq",
			"name",
			"parentSeq",
			"parent",
			"children",
		],
		required: [
			"id",
			"createdAt",
			"updatedAt",
			"removedAt",
			"spaceSeq",
			"name",
			"parentSeq",
		],
	},
	{
		dto: CompanyDto,
		fields: [
			"id",
			"createdAt",
			"updatedAt",
			"removedAt",
			"name",
			"label",
			"address",
			"phone",
			"email",
			"businessNo",
			"logoImageFileId",
			"fitnessCenters",
		],
		required: [
			"id",
			"createdAt",
			"updatedAt",
			"removedAt",
			"name",
			"address",
			"phone",
			"email",
			"businessNo",
		],
	},
	{
		dto: ExerciseDto,
		fields: [
			"id",
			"createdAt",
			"updatedAt",
			"removedAt",
			"duration",
			"count",
			"taskSeq",
			"description",
			"imageFileId",
			"videoFileId",
			"name",
			"task",
		],
		required: [
			"id",
			"createdAt",
			"updatedAt",
			"removedAt",
			"duration",
			"count",
			"taskSeq",
			"name",
			"task",
		],
	},
	{
		dto: FitnessCenterDto,
		fields: [
			"id",
			"createdAt",
			"updatedAt",
			"removedAt",
			"address",
			"phone",
			"email",
			"companySeq",
			"imageFileId",
			"spaceSeq",
			"company",
			"space",
		],
		required: [
			"id",
			"createdAt",
			"updatedAt",
			"removedAt",
			"address",
			"phone",
			"email",
			"companySeq",
			"spaceSeq",
		],
	},
	{
		dto: GroupDto,
		fields: [
			"id",
			"createdAt",
			"updatedAt",
			"removedAt",
			"spaceSeq",
			"name",
			"label",
			"type",
			"createdBySeq",
		],
		required: [
			"id",
			"createdAt",
			"updatedAt",
			"removedAt",
			"spaceSeq",
			"name",
			"type",
		],
	},
	{
		dto: PasswordHistoryDto,
		fields: ["id", "createdAt", "userSeq"],
		required: ["id", "createdAt", "userSeq"],
	},
	{
		dto: ProfileDto,
		fields: [
			"id",
			"createdAt",
			"updatedAt",
			"removedAt",
			"avatarFileId",
			"name",
			"nickname",
			"address",
			"userSeq",
			"user",
		],
		required: [
			"id",
			"createdAt",
			"updatedAt",
			"removedAt",
			"avatarFileId",
			"name",
			"nickname",
			"address",
			"userSeq",
		],
	},
	{
		dto: ProgramActivityDto,
		fields: [
			"id",
			"createdAt",
			"updatedAt",
			"removedAt",
			"programSeq",
			"taskSeq",
			"order",
			"repetitions",
			"restTime",
			"notes",
			"exerciseName",
			"exerciseDescription",
			"exerciseDuration",
			"exerciseCount",
			"imageFileId",
			"videoFileId",
		],
		required: [
			"id",
			"createdAt",
			"updatedAt",
			"removedAt",
			"programSeq",
			"taskSeq",
			"order",
			"repetitions",
			"restTime",
			"exerciseName",
			"exerciseDuration",
			"exerciseCount",
		],
	},
	{
		dto: ProgramDto,
		fields: [
			"id",
			"createdAt",
			"updatedAt",
			"removedAt",
			"routineSeq",
			"sessionSeq",
			"instructorSeq",
			"capacity",
			"name",
			"level",
			"routineNameSnapshot",
			"routineLabelSnapshot",
			"activityCount",
			"previewExerciseNames",
			"routine",
			"session",
			"executionPlan",
		],
		required: [
			"id",
			"createdAt",
			"updatedAt",
			"removedAt",
			"routineSeq",
			"sessionSeq",
			"instructorSeq",
			"capacity",
			"name",
			"routine",
			"session",
		],
	},
	{
		dto: RoleAssociationDto,
		fields: ["id", "createdAt", "updatedAt", "removedAt", "roleSeq", "groupSeq"],
		required: [
			"id",
			"createdAt",
			"updatedAt",
			"removedAt",
			"roleSeq",
			"groupSeq",
		],
	},
	{
		dto: RoleClassificationDto,
		fields: [
			"id",
			"createdAt",
			"updatedAt",
			"removedAt",
			"roleSeq",
			"categorySeq",
			"category",
			"role",
		],
		required: [
			"id",
			"createdAt",
			"updatedAt",
			"removedAt",
			"roleSeq",
			"categorySeq",
		],
	},
	{
		dto: RoleDto,
		fields: [
			"id",
			"createdAt",
			"updatedAt",
			"removedAt",
			"name",
			"displayName",
			"description",
			"classification",
			"associations",
			"assignments",
		],
		required: [
			"id",
			"createdAt",
			"updatedAt",
			"removedAt",
			"name",
			"classification",
			"associations",
		],
	},
	{
		dto: RoutineDto,
		fields: [
			"id",
			"createdAt",
			"updatedAt",
			"removedAt",
			"name",
			"label",
			"spaceSeq",
			"createdBySeq",
			"programs",
			"activities",
		],
		required: [
			"id",
			"createdAt",
			"updatedAt",
			"removedAt",
			"name",
			"label",
			"spaceSeq",
			"programs",
			"activities",
		],
	},
	{
		dto: SecurityPolicyDto,
		fields: [
			"id",
			"createdAt",
			"updatedAt",
			"key",
			"passwordMinLength",
			"passwordRequireUppercase",
			"passwordRequireLowercase",
			"passwordRequireNumber",
			"passwordRequireSpecial",
			"passwordExpirationDays",
			"passwordReuseLimit",
			"temporaryLockThreshold",
			"temporaryLockDurationMin",
			"permanentLockThreshold",
			"accessTokenTtlSec",
			"refreshTokenTtlSec",
			"sessionTtlSec",
			"ipWhitelistEnabled",
			"emailDomainWhitelistEnabled",
			"corsOriginWhitelistEnabled",
		],
		required: [
			"id",
			"createdAt",
			"key",
			"passwordMinLength",
			"passwordRequireUppercase",
			"passwordRequireLowercase",
			"passwordRequireNumber",
			"passwordRequireSpecial",
			"passwordExpirationDays",
			"passwordReuseLimit",
			"temporaryLockThreshold",
			"temporaryLockDurationMin",
			"permanentLockThreshold",
			"accessTokenTtlSec",
			"refreshTokenTtlSec",
			"sessionTtlSec",
			"ipWhitelistEnabled",
			"emailDomainWhitelistEnabled",
			"corsOriginWhitelistEnabled",
		],
	},
	{
		dto: SessionDto,
		fields: [
			"id",
			"createdAt",
			"updatedAt",
			"removedAt",
			"type",
			"repeatCycleType",
			"startDateTime",
			"endDateTime",
			"recurringDayOfWeek",
			"timelineSeq",
			"name",
			"description",
			"programs",
			"timeline",
		],
		required: [
			"id",
			"createdAt",
			"updatedAt",
			"removedAt",
			"type",
			"timelineSeq",
			"name",
			"programs",
			"timeline",
		],
	},
	{
		dto: SpaceAssociationDto,
		fields: ["id", "createdAt", "updatedAt", "removedAt", "spaceSeq", "groupSeq"],
		required: [
			"id",
			"createdAt",
			"updatedAt",
			"removedAt",
			"spaceSeq",
			"groupSeq",
		],
	},
	{
		dto: SpaceClassificationDto,
		fields: [
			"id",
			"createdAt",
			"updatedAt",
			"removedAt",
			"spaceSeq",
			"categorySeq",
			"category",
			"space",
		],
		required: [
			"id",
			"createdAt",
			"updatedAt",
			"removedAt",
			"spaceSeq",
			"categorySeq",
		],
	},
	{
		dto: SpaceDto,
		fields: [
			"id",
			"createdAt",
			"updatedAt",
			"removedAt",
			"tenantId",
			"name",
			"label",
			"contentLanguageCode",
			"spaceClassification",
			"spaceAssociations",
			"fitnessCenter",
		],
		required: [
			"id",
			"createdAt",
			"updatedAt",
			"removedAt",
			"name",
			"contentLanguageCode",
		],
	},
	{
		dto: TaskDto,
		fields: [
			"id",
			"createdAt",
			"updatedAt",
			"removedAt",
			"spaceSeq",
			"createdBySeq",
			"exercise",
			"activities",
		],
		required: [
			"id",
			"createdAt",
			"updatedAt",
			"removedAt",
			"spaceSeq",
			"exercise",
			"activities",
		],
	},
	{
		dto: TenantDto,
		fields: [
			"id",
			"createdAt",
			"updatedAt",
			"removedAt",
			"roleSeq",
			"userSeq",
			"spaceSeq",
			"user",
			"space",
			"role",
		],
		required: [
			"id",
			"createdAt",
			"updatedAt",
			"removedAt",
			"roleSeq",
			"userSeq",
			"spaceSeq",
		],
	},
	{
		dto: TimelineDto,
		fields: [
			"id",
			"createdAt",
			"updatedAt",
			"removedAt",
			"spaceSeq",
			"createdBySeq",
			"name",
			"description",
			"sessions",
		],
		required: [
			"id",
			"createdAt",
			"updatedAt",
			"removedAt",
			"spaceSeq",
			"name",
			"sessions",
		],
	},
	{
		dto: UserAssociationDto,
		fields: ["id", "createdAt", "updatedAt", "removedAt", "userSeq", "groupSeq"],
		required: [
			"id",
			"createdAt",
			"updatedAt",
			"removedAt",
			"userSeq",
			"groupSeq",
		],
	},
	{
		dto: UserClassificationDto,
		fields: [
			"id",
			"createdAt",
			"updatedAt",
			"removedAt",
			"categorySeq",
			"userSeq",
			"user",
			"category",
		],
		required: [
			"id",
			"createdAt",
			"updatedAt",
			"removedAt",
			"categorySeq",
			"userSeq",
		],
	},
	{
		dto: UserDto,
		fields: [
			"id",
			"createdAt",
			"updatedAt",
			"removedAt",
			"spaceSeq",
			"email",
			"name",
			"phone",
			"failedLoginAttempts",
			"lockedUntil",
			"isPermanentlyLocked",
			"passwordChangedAt",
			"lastLoginAt",
			"lastLoginIp",
			"isActive",
			"currentTenantSeq",
			"profiles",
			"tenants",
			"associations",
			"classification",
		],
		required: [
			"id",
			"createdAt",
			"updatedAt",
			"removedAt",
			"spaceSeq",
			"email",
			"name",
			"phone",
			"failedLoginAttempts",
			"lockedUntil",
			"isPermanentlyLocked",
			"passwordChangedAt",
			"lastLoginAt",
			"lastLoginIp",
			"isActive",
			"currentTenantSeq",
		],
	},
	{
		dto: WhitelistEntryDto,
		fields: [
			"id",
			"createdAt",
			"updatedAt",
			"type",
			"value",
			"description",
			"isActive",
		],
		required: ["id", "createdAt", "type", "value", "isActive"],
	},
	{
		dto: TemplateVariableDto,
		fields: [
			"id",
			"createdAt",
			"updatedAt",
			"name",
			"description",
			"defaultValue",
			"isRequired",
			"templateSeq",
		],
		required: ["id", "createdAt", "name", "isRequired", "templateSeq"],
	},
	{
		dto: TemplateDto,
		fields: [
			"id",
			"createdAt",
			"updatedAt",
			"removedAt",
			"code",
			"name",
			"type",
			"subject",
			"content",
			"description",
			"isActive",
		],
		required: [
			"id",
			"createdAt",
			"updatedAt",
			"removedAt",
			"code",
			"name",
			"type",
			"content",
			"isActive",
		],
	},
	{
		dto: AbilityDto,
		fields: [
			"id",
			"createdAt",
			"updatedAt",
			"removedAt",
			"actionSeq",
			"inverted",
			"reason",
			"subjectSeq",
			"name",
			"description",
			"action",
			"subject",
			"priority",
		],
		required: [
			"id",
			"createdAt",
			"updatedAt",
			"removedAt",
			"actionSeq",
			"inverted",
			"subjectSeq",
			"name",
		],
	},
	{
		dto: SubjectDto,
		fields: [
			"id",
			"createdAt",
			"updatedAt",
			"removedAt",
			"name",
			"displayName",
			"icon",
			"group",
			"order",
		],
		required: ["id", "createdAt", "updatedAt", "removedAt", "name", "order"],
	},
	{
		dto: AbilitySummaryDto,
		fields: [
			"id",
			"name",
			"actionSeq",
			"subjectSeq",
			"inverted",
			"priority",
			"action",
			"subject",
		],
		required: ["id", "name", "actionSeq", "subjectSeq", "inverted"],
	},
	{
		dto: SubjectSummaryDto,
		fields: ["id", "name", "displayName", "group"],
		required: ["id", "name"],
	},
] as const;

describe("Entity 기반 핵심 응답 계약", () => {
	it.each(
		originalResponseContracts,
	)("$dto.name의 기존 공개 필드와 필수 속성을 보존한다", ({
		dto,
		fields,
		required,
	}) => {
		const { schema } = generateSchema(dto as Type<object>);
		expect(Object.keys(schema.properties ?? {}).sort()).toEqual(
			[...fields].sort(),
		);
		expect([...(schema.required ?? [])].sort()).toEqual(
			[...required].sort(),
		);
	});
	it("User → Tenant → Role의 루트·중첩 공개 필드만 변환한다", () => {
		prepareEntityResponseType(UserDto);
		const userResponse = plainToInstance(UserDto, {
			id: "1",
			spaceSeq: "2",
			email: "USER@EXAMPLE.COM",
			name: "회원",
			userSeq: "internal-ulid",
			password: "hash",
			unknown: true,
			profiles: [
				{ id: "3", name: "공개 프로필", profileId: "private", unknown: true },
			],
			classification: {
				id: "4",
				user: { id: "5", name: "분류 회원", password: "secret", unknown: true },
				category: { id: "6", name: "분류", categorySeq: "private" },
			},
			tenants: [
				{
					id: "7",
					tenantId: "private",
					unknown: true,
					role: {
						id: "8",
						name: "USER",
						roleSeq: "private",
						unknown: true,
						associations: [
							{
								id: "9",
								roleAssociationId: "private",
								group: {
									id: "10",
									name: "그룹",
									groupSeq: "private",
									unknown: true,
								},
							},
						],
					},
				},
			],
		});
		expect(userResponse.spaceSeq).toBe(2n);
		expect(userResponse.profiles?.[0]).toBeInstanceOf(ProfileDto);
		expect(userResponse.classification?.user).toBeInstanceOf(UserDto);
		expect(userResponse.classification?.category).toBeInstanceOf(CategoryDto);
		expect(userResponse.tenants?.[0]).toBeInstanceOf(TenantDto);
		expect(userResponse.tenants?.[0].role).toBeInstanceOf(RoleDto);
		const publicResponse = instanceToPlain(userResponse);
		expect(publicResponse.email).toBe("user@example.com");
		expect(publicResponse.spaceSeq).toBe("2");
		const responseJson = JSON.stringify(publicResponse);
		for (const privateContent of [
			"password",
			"unknown",
			"private",
			"internal-ulid",
		])
			expect(responseJson).not.toContain(privateContent);
		expect(publicResponse.classification.user.name).toBe("분류 회원");
		expect(publicResponse.tenants[0].role.associations[0].group.name).toBe(
			"그룹",
		);
	});
	it("Entity를 직접 받은 응답도 도메인 메서드와 비공개 필드를 복사하지 않는다", () => {
		const persistedUser = hydrateEntity(User, {
			seq: 1n,
			email: "CASE@EXAMPLE.COM",
			password: "hash",
			id: "internal-ulid",
		});
		prepareEntityResponseType(UserDto);
		const response = plainToInstance(UserDto, persistedUser);
		expect(response).not.toBeInstanceOf(User);
		expect(response).not.toHaveProperty("toDto");
		expect(response).not.toHaveProperty("password");
		expect(persistedUser.email).toBe("CASE@EXAMPLE.COM");
		expect(persistedUser.password).toBe("hash");
	});
	it("집계·실행계획과 JSON 응답 projection을 유지한다", () => {
		prepareEntityResponseType(ProgramDto);
		const programResponse = plainToInstance(ProgramDto, {
			id: "1",
			name: "수업",
			activityCount: 1,
			previewExerciseNames: ["스쿼트"],
			executionPlan: [
				{
					id: "2",
					exerciseName: "스쿼트",
					programActivityId: "private",
					unknown: true,
				},
			],
			unknown: true,
		});
		expect(programResponse.activityCount).toBe(1);
		expect(programResponse.previewExerciseNames).toEqual(["스쿼트"]);
		expect(programResponse.executionPlan?.[0]).toBeInstanceOf(
			ProgramActivityDto,
		);
		expect(JSON.stringify(instanceToPlain(programResponse))).not.toContain(
			"private",
		);
		expect(JSON.stringify(instanceToPlain(programResponse))).not.toContain(
			"unknown",
		);
		prepareEntityResponseType(AbilityDto);
		const abilityResponse = plainToInstance(AbilityDto, {
			name: "read",
			fields: ["email"],
			conditions: { ownerId: "user" },
			policyEntries: [{ id: 1 }],
			action: { name: "read", config: { preset: "email" }, abilities: [{}] },
		});
		expect(abilityResponse.fields).toEqual(["email"]);
		expect(abilityResponse.conditions).toEqual({ ownerId: "user" });
		expect(abilityResponse.action?.config).toEqual({ preset: "email" });
		expect(abilityResponse).not.toHaveProperty("policyEntries");
		expect(abilityResponse.action).not.toHaveProperty("abilities");
	});
	it("상호 참조 스키마에서 배열·nullable·설명과 API 전용 nullable 차이를 유지한다", () => {
		let schemas: Record<string, SchemaObject> = {};
		schemas = generateSchema(UserDto, schemas).schemas;
		schemas = generateSchema(AbilityDto, schemas).schemas;
		schemas = generateSchema(SpaceDto, schemas).schemas;
		expect(schemas.UserDto.properties?.profiles).toEqual({
			description: "프로필 목록",
			type: "array",
			items: { $ref: "#/components/schemas/ProfileDto" },
		});
		expect(schemas.RoleDto.properties?.associations).toEqual({
			nullable: true,
			type: "array",
			items: { $ref: "#/components/schemas/RoleAssociationDto" },
		});
		expect(schemas.UserClassificationDto.properties?.user).toEqual({
			$ref: "#/components/schemas/UserDto",
		});
		expect(
			schemas.SubjectSummaryDto.properties?.displayName,
		).not.toHaveProperty("nullable");
		expect(
			schemas.FitnessCenterSpaceDto.properties?.contentLanguageCode,
		).not.toHaveProperty("default");
		expect(schemas.AbilityDto.properties).not.toHaveProperty("conditions");
		expect(schemas.AbilityDto.properties).not.toHaveProperty("fields");
	});
});
