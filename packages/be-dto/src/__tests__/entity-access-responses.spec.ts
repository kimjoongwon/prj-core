import "reflect-metadata";
import { OidcClient } from "@cocrepo/entity";
import type { Type } from "@nestjs/common";
import { ModelPropertiesAccessor } from "@nestjs/swagger/dist/services/model-properties-accessor";
import { SchemaObjectFactory } from "@nestjs/swagger/dist/services/schema-object-factory";
import { SwaggerTypesMapper } from "@nestjs/swagger/dist/services/swagger-types-mapper";
import { instanceToPlain, plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { describe, expect, it } from "vitest";
import { AbilityResponseDto } from "../abilities/ability-response.dto";
import { ActionResponseDto } from "../abilities/action-response.dto";
import { LoginResponseDto } from "../auth/login-response.dto";
import { EmailVerificationDto } from "../email-verification/email-verification.dto";
import { IdpAccountDto } from "../idp/idp-account.dto";
import { IdpAccountDetailDto } from "../idp/idp-account-detail.dto";
import { prepareEntityResponseType } from "../mapped-types";
import { OidcClientDto } from "../oidc/oidc-client.dto";
import { OidcSessionDto } from "../oidc/oidc-session.dto";
import { PolicyEntryResponseDto } from "../policies/policy-entry-response.dto";
import { PolicyResponseDto } from "../policies/policy-response.dto";
import { RoleAssignmentResponseDto } from "../role-assignments/role-assignment-response.dto";
import { TenantAccessRequestDto } from "../tenant-access-requests/tenant-access-request.dto";
import { UserDetailResponseDto } from "../users/user-detail-response.dto";

function serializeAccessResponse<T>(responseClass: Type<T>, snapshot: object) {
	prepareEntityResponseType(responseClass);
	return instanceToPlain(plainToInstance(responseClass, snapshot));
}

function accessResponseSchemas() {
	const schemas: Record<
		string,
		{ properties: Record<string, Record<string, unknown>>; required?: string[] }
	> = {};
	const schemaFactory = new SchemaObjectFactory(
		new ModelPropertiesAccessor(),
		new SwaggerTypesMapper(),
	);
	for (const responseClass of [
		PolicyResponseDto,
		PolicyEntryResponseDto,
		RoleAssignmentResponseDto,
		AbilityResponseDto,
		ActionResponseDto,
		OidcClientDto,
		OidcSessionDto,
		EmailVerificationDto,
		IdpAccountDto,
		IdpAccountDetailDto,
		TenantAccessRequestDto,
	]) {
		schemaFactory.exploreModelSchema(responseClass, schemas);
	}
	return schemas;
}

describe("접근·인증 Entity 응답", () => {
	it("정책·항목·권한·행위 중첩 응답에서 공개 필드만 남긴다", () => {
		const response = serializeAccessResponse(RoleAssignmentResponseDto, {
			id: 1n,
			roleId: 2n,
			policyId: 3n,
			isActive: true,
			priority: 0,
			roleAssignmentId: "private-assignment",
			unknown: true,
			policy: {
				id: 3n,
				name: "admins",
				policyId: "private-policy",
				unknown: true,
				roleAssignments: [],
				entries: [
					{
						id: 4n,
						abilityId: 5n,
						policyEntryId: "private-entry",
						unknown: true,
						ability: {
							id: 5n,
							name: "read",
							fields: ["email"],
							conditions: { owner: "${user.id}" },
							abilityId: "private-ability",
							unknown: true,
							action: {
								id: 6n,
								name: "read",
								actionId: "private-action",
								unknown: true,
							},
							subject: {
								name: "User",
								displayName: "사용자",
								fieldCount: 2,
								unknown: true,
							},
						},
					},
				],
			},
		});
		expect(response).not.toHaveProperty("roleAssignmentId");
		expect(response).not.toHaveProperty("unknown");
		expect(response.policy).not.toHaveProperty("policyId");
		expect(response.policy).not.toHaveProperty("roleAssignments");
		expect(response.policy.entries[0]).not.toHaveProperty("policyEntryId");
		expect(response.policy.entries[0].ability).not.toHaveProperty("abilityId");
		expect(response.policy.entries[0].ability.action).not.toHaveProperty(
			"actionId",
		);
		expect(response.policy.entries[0].ability.subject).toEqual({
			name: "User",
			displayName: "사용자",
			fieldCount: 2,
		});
		expect(response.policy.entries[0].ability.conditions).toEqual({
			owner: "${user.id}",
		});
	});

	it("행위 설정의 API 전용 중첩 객체에서도 공개 설정만 남긴다", () => {
		const response = serializeAccessResponse(ActionResponseDto, {
			id: 1n,
			name: "read:masked",
			config: { type: "masking", preset: "PRESET_EMAIL", unknown: true },
			unknown: true,
		});
		expect(response.config).toEqual({
			type: "masking",
			preset: "PRESET_EMAIL",
		});
		expect(response).not.toHaveProperty("unknown");
	});

	it("로그인 wrapper 토큰과 사용자 상세의 API 필드를 보존하고 사용자 비밀을 제외한다", () => {
		const response = serializeAccessResponse(LoginResponseDto, {
			accessToken: "access",
			refreshToken: "refresh",
			accessTokenExpiresAt: 10,
			refreshTokenExpiresAt: 20,
			user: {
				id: 1n,
				name: "User",
				email: "user@example.com",
				spaceId: 2n,
				password: "hash",
				userId: "private-user",
				unknown: true,
				passwordHistory: [{ hash: "secret" }],
			},
		});
		expect(response.accessToken).toBe("access");
		expect(response.refreshToken).toBe("refresh");
		expect(response.user.spaceId).toBe("2");
		for (const privateKey of [
			"password",
			"userId",
			"unknown",
			"passwordHistory",
		])
			expect(response.user).not.toHaveProperty(privateKey);
		const detail = serializeAccessResponse(UserDetailResponseDto, {
			id: 1n,
			spaceId: 2n,
			password: "hash",
			unknown: true,
		});
		expect(detail.spaceId).toBe("2");
		expect(detail).not.toHaveProperty("password");
		expect(detail).not.toHaveProperty("unknown");
	});

	it("이메일 인증 재발송 projection을 남기고 저장된 해시·내부 관계를 제외한다", () => {
		const response = serializeAccessResponse(EmailVerificationDto, {
			id: 1n,
			email: "user@example.com",
			canResend: true,
			resendAvailableAt: null,
			passwordHash: "hash",
			tokenHash: "token",
			emailVerificationId: "private-verification",
			verifiedUser: { password: "hash" },
			unknown: true,
		});
		expect(response.canResend).toBe(true);
		expect(response.resendAvailableAt).toBeNull();
		for (const privateKey of [
			"passwordHash",
			"tokenHash",
			"emailVerificationId",
			"verifiedUser",
			"unknown",
		])
			expect(response).not.toHaveProperty(privateKey);
	});

	it("IdP 상세와 OIDC 세션의 API 전용 projection을 유지한다", () => {
		const account = serializeAccessResponse(IdpAccountDetailDto, {
			id: 1n,
			name: "User",
			email: "user@example.com",
			password: "hash",
			phone: "01012345678",
			unknown: true,
			accessGrants: [
				{ tenantId: 2n, roleName: "admin", spaceName: "Space", unknown: true },
			],
		});
		expect(account.accessGrants).toHaveLength(1);
		expect(account.accessGrants[0].roleName).toBe("admin");
		expect(account.accessGrants[0]).not.toHaveProperty("unknown");
		expect(account).not.toHaveProperty("password");
		expect(account).not.toHaveProperty("phone");
		const session = serializeAccessResponse(OidcSessionDto, {
			id: 1n,
			key: "jti",
			modelType: "Session",
			accountId: "account",
			payload: { private: true },
			oidcModelId: "private-model",
			expiresAt: null,
			unknown: true,
		});
		expect(session.accountId).toBe("account");
		expect(session).not.toHaveProperty("payload");
		expect(session).not.toHaveProperty("oidcModelId");
	});

	it("OIDC 관리자 응답의 기존 공개 clientSecret와 object loginUi 계약을 보존한다", () => {
		const response = serializeAccessResponse(OidcClientDto, {
			clientId: "admin",
			clientSecret: "visible-admin-secret",
			loginUi: { title: "로그인", nested: { theme: "light" } },
			oidcClientId: "private-client",
			unknown: true,
		});
		expect(response.clientSecret).toBe("visible-admin-secret");
		expect(response.loginUi).toEqual({
			title: "로그인",
			nested: { theme: "light" },
		});
		expect(response).not.toHaveProperty("oidcClientId");
		expect(response).not.toHaveProperty("unknown");
		const invalidClient = plainToInstance(OidcClient, { loginUi: [] });
		expect(
			validateSync(invalidClient).find((error) => error.property === "loginUi")
				?.constraints,
		).toHaveProperty("isObject");
	});

	it("기존 응답 스키마명과 optional·nullable·배열 형태를 유지한다", () => {
		const schemas = accessResponseSchemas();
		expect(schemas.PolicyResponseDto.required?.sort()).toEqual(
			[
				"id",
				"spaceId",
				"createdById",
				"name",
				"displayName",
				"description",
				"createdAt",
				"updatedAt",
				"removedAt",
			].sort(),
		);
		expect(schemas.PolicyResponseDto.properties.entries).toMatchObject({
			type: "array",
			items: { $ref: "#/components/schemas/PolicyEntryResponseDto" },
		});
		expect(schemas.PolicyEntryResponseDto.properties.ability).toMatchObject({
			allOf: [{ $ref: "#/components/schemas/AbilityResponseDto" }],
		});
		expect(schemas.IdpAccountDto.required?.sort()).toEqual(
			[
				"id",
				"name",
				"email",
				"isActive",
				"failedLoginAttempts",
				"isPermanentlyLocked",
				"mustChangePassword",
				"createdAt",
			].sort(),
		);
		expect(schemas.IdpAccountDetailDto.required).toContain("accessGrants");
		expect(schemas.OidcSessionDto.required?.sort()).toEqual(
			["id", "key", "modelType", "expiresAt", "createdAt"].sort(),
		);
		expect(schemas.EmailVerificationDto.required?.sort()).toEqual(
			[
				"id",
				"createdAt",
				"email",
				"name",
				"status",
				"expiresAt",
				"sendCount",
				"canResend",
			].sort(),
		);
		expect(schemas.OidcClientDto.properties.loginUi).toMatchObject({
			type: "object",
			additionalProperties: true,
			nullable: true,
		});
		expect(schemas.TenantAccessRequestDto.properties.reviewer).toMatchObject({
			nullable: true,
			allOf: [{ $ref: "#/components/schemas/UserDto" }],
		});
	});
});
