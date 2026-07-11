import { ResponseExcludedField } from "@cocrepo/constant";
import {
	BooleanField,
	ClassField,
	DateField,
	EmailField,
	NumberField,
	PasswordField,
	StringField,
	StringFieldOptional,
	UUIDField,
	UUIDFieldOptional,
} from "@cocrepo/decorator";
import type { User } from "@cocrepo/prisma";
import { Exclude } from "class-transformer";
import { ProfileDto, UserClassificationDto } from ".";
import { AbstractDto } from "./abstract.dto";
import { TenantDto } from "./tenant.dto";
import { UserAssociationDto } from "./user-association.dto";

export class UserDto extends AbstractDto implements User {
	@UUIDField({ description: "소속 공간 ID" })
	spaceId: string;

	@EmailField({ description: "이메일 주소" })
	email: string;

	@StringField({ description: "사용자 이름" })
	name: string;

	@StringField({ description: "연락처" })
	phone: string;

	@Exclude()
	@PasswordField({ description: ResponseExcludedField })
	password!: string;

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

	@UUIDFieldOptional({
		nullable: true,
		description: "현재 선택된 Tenant membership ID",
	})
	currentTenantId!: string | null;

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
