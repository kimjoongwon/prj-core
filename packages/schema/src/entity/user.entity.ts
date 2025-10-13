import {
	Profile,
	Tenant,
	UserAssociation,
	User as UserEntity,
} from "@prisma/client";
import { UseDto } from "../decorator/use-dto.decorator";
import { UserDto } from "../dto";
import { AbstractEntity } from "./abstract.entity";

@UseDto(UserDto)
export class User extends AbstractEntity<UserDto> implements UserEntity {
	name: string;
	email: string;
	phone: string;
	password: string;

	profiles?: Profile[];
	tenants?: Tenant[];
	associations?: UserAssociation[];

	getMainTenant(): Tenant | undefined {
		return this.tenants?.find((tenant) => tenant.main === true);
	}
}
