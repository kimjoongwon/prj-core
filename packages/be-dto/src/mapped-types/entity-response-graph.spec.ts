import "reflect-metadata";
import { instanceToPlain, plainToInstance } from "class-transformer";
import { describe, expect, expectTypeOf, it } from "vitest";
import { CategoryDto } from "../category.dto";
import { FolderDto } from "../folder/folder.dto";
import { ProfileDto } from "../profile.dto";
import { TenantDto } from "../tenant.dto";
import { UserDto } from "../user.dto";
import { prepareEntityResponseType } from "./prepare-entity-response-type";

describe("실제 Entity 응답 DTO 순환 그래프", () => {
	it("Category와 Folder 자기 참조가 모듈 로드·타입·중첩 변환을 통과한다", () => {
		expectTypeOf<CategoryDto["parent"]>().toEqualTypeOf<
			CategoryDto | undefined
		>();
		expectTypeOf<CategoryDto["children"]>().toEqualTypeOf<
			CategoryDto[] | undefined
		>();
		expectTypeOf<FolderDto["children"]>().toEqualTypeOf<
			FolderDto[] | undefined
		>();
		prepareEntityResponseType(CategoryDto);
		prepareEntityResponseType(FolderDto);
		const category = plainToInstance(CategoryDto, {
			name: "root",
			children: [{ name: "child", categoryId: "internal", unknown: true }],
		});
		const folder = plainToInstance(FolderDto, {
			name: "root",
			children: [{ name: "child", folderId: "internal", unknown: true }],
		});
		expect(category.children?.[0]).toBeInstanceOf(CategoryDto);
		expect(folder.children?.[0]).toBeInstanceOf(FolderDto);
		expect(instanceToPlain(category)).not.toHaveProperty("children.0.unknown");
		expect(instanceToPlain(folder)).not.toHaveProperty("children.0.folderId");
	});

	it("User·Tenant·Profile 실제 상호 참조의 공개 타입과 변환 인스턴스를 유지한다", () => {
		expectTypeOf<UserDto["tenants"]>().toEqualTypeOf<TenantDto[] | undefined>();
		expectTypeOf<UserDto["profiles"]>().toEqualTypeOf<
			ProfileDto[] | undefined
		>();
		expectTypeOf<TenantDto["user"]>().toEqualTypeOf<UserDto | undefined>();
		expectTypeOf<ProfileDto["user"]>().toEqualTypeOf<UserDto | undefined>();
		prepareEntityResponseType(UserDto);
		const user = plainToInstance(UserDto, {
			name: "회원",
			password: "hash",
			userId: "internal",
			tenants: [
				{
					id: 1n,
					user: {
						name: "중첩 회원",
						password: "nested-hash",
						profiles: [
							{ name: "프로필", profileId: "internal", unknown: true },
						],
					},
				},
			],
		});
		expect(user.tenants?.[0]).toBeInstanceOf(TenantDto);
		expect(user.tenants?.[0].user).toBeInstanceOf(UserDto);
		expect(user.tenants?.[0].user?.profiles?.[0]).toBeInstanceOf(ProfileDto);
		expect(instanceToPlain(user)).not.toHaveProperty("password");
		expect(instanceToPlain(user)).not.toHaveProperty("tenants.0.user.password");
		expect(instanceToPlain(user)).not.toHaveProperty(
			"tenants.0.user.profiles.0.unknown",
		);
	});
});
