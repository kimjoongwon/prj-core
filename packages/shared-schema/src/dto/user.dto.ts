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
	@UUIDField()
	spaceId!: string;

	@EmailField()
	email!: string;

	@StringField()
	name!: string;

	@StringField()
	phone!: string;

	@Exclude()
	@PasswordField({ description: ResponseExcludedField })
	password!: string;

	@ClassField(() => ProfileDto, { each: true, required: false })
	profiles?: ProfileDto[];

	@ClassField(() => TenantDto, { each: true, required: false })
	tenants?: TenantDto[];

	@ClassField(() => UserAssociationDto, {
		required: false,
	})
	associations?: UserAssociationDto[];

	@ClassField(() => UserClassificationDto, { required: false })
	classification?: UserClassificationDto;
}
