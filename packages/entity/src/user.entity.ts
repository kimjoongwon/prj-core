import {
	Profile,
	Tenant,
	UserAssociation,
	User as UserEntity,
} from "@prisma/client";
import { AbstractEntity } from "./abstract.entity";

export class User extends AbstractEntity implements UserEntity {
	name!: string;
	email!: string;
	phone!: string;
	password!: string;

	profiles?: Profile[];
	tenants?: Tenant[];
	associations?: UserAssociation[];

	getMainTenant(): Tenant | undefined {
		return this.tenants?.find((tenant) => tenant.main === true);
	}
}
