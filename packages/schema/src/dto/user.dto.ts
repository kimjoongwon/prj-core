import { User } from "@prisma/client";
import { Exclude } from "class-transformer";
import { ResponseExcludedField } from "../constant";
import {
	ClassField,
	EmailField,
	PasswordField,
	StringField,
	UUIDField,
} from "../decorator/field";
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
