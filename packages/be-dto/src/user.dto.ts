import {
	BigIntIdField,
	BigIntIdFieldOptional,
	BooleanField,
	ClassField,
	DateField,
	EmailField,
	NumberField,
	StringField,
	StringFieldOptional,
} from "@cocrepo/decorator/field";
import type { DomainEntityModel } from "@cocrepo/entity";
import type { User } from "@cocrepo/prisma";
import { Exclude } from "class-transformer";
import { AbstractDto } from "./abstract.dto";
import { ProfileDto } from "./profile.dto";
import { TenantDto } from "./tenant.dto";
import { UserAssociationDto } from "./user-association.dto";
import { UserClassificationDto } from "./user-classification.dto";

export class UserDto
	extends AbstractDto
	implements DomainEntityModel<User, "userId" | "password">
{
	@Exclude()
	// biome-ignore lint/correctness/noUnusedPrivateClassMembers: class-transformer가 일반 REST 응답에서 이 필드를 제외하려면 선언이 필요합니다.
	private readonly userId?: never;

	@Exclude()
	// biome-ignore lint/correctness/noUnusedPrivateClassMembers: class-transformer가 일반 REST 응답에서 이 필드를 제외하려면 선언이 필요합니다.
	private readonly password?: never;

	@BigIntIdField({ description: "소속 공간 ID" })
	spaceId: bigint;

	@EmailField({ description: "이메일 주소" })
	email: string;

	@StringField({ description: "사용자 이름" })
	name: string;

	@StringField({ description: "연락처" })
	phone: string;

	@NumberField({ description: "로그인 실패 횟수" })
	failedLoginAttempts!: number;

	@DateField({ nullable: true, description: "잠금 해제 시각" })
	lockedUntil!: Date | null;

	@BooleanField({ description: "영구 잠금 여부" })
	isPermanentlyLocked!: boolean;

	@BooleanField({ description: "비밀번호 변경 필요" })
	mustChangePassword!: boolean;

	@DateField({ nullable: true, description: "비밀번호 변경일" })
	passwordChangedAt!: Date | null;

	@DateField({ nullable: true, description: "마지막 로그인 시각" })
	lastLoginAt!: Date | null;

	@StringFieldOptional({ nullable: true, description: "마지막 로그인 IP" })
	lastLoginIp!: string | null;

	@BooleanField({ description: "활성 상태" })
	isActive!: boolean;

	@BigIntIdFieldOptional({
		nullable: true,
		description: "현재 선택된 Tenant membership ID",
	})
	currentTenantId!: bigint | null;

	@ClassField(() => ProfileDto, {
		isArray: true,
		required: false,
		description: "프로필 목록",
	})
	profiles?: ProfileDto[];

	@ClassField(() => TenantDto, {
		isArray: true,
		required: false,
		description: "테넌트 목록",
	})
	tenants?: TenantDto[];

	@ClassField(() => UserAssociationDto, {
		required: false,
		isArray: true,
		description: "사용자 연결 정보",
	})
	associations?: UserAssociationDto[];

	@ClassField(() => UserClassificationDto, {
		required: false,
		description: "사용자 분류 정보",
	})
	classification?: UserClassificationDto;
}
