import { User } from "@prisma/client";
import { Exclude } from "class-transformer";
import { ResponseExcludedField } from "../constant";
import {
	ClassField,
	EmailField,
	PasswordField,
	StringField,
	UUIDField,
} from "../decorator/field.decorators";
import { ProfileDto } from ".";
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

	@ClassField(() => ProfileDto, { each: true, required: false, swagger: false })
	profiles?: ProfileDto[];

	@ClassField(() => TenantDto, { each: true, required: false, swagger: false })
	tenants?: TenantDto[];

	@ClassField(() => UserAssociationDto, {
		each: true,
		required: false,
		swagger: false,
	})
	associations?: UserAssociationDto[];
}
